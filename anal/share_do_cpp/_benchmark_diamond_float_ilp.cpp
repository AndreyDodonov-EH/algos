#include <algorithm>
#include <chrono>
#include <cmath>
#include <cstdint>
#include <cstring>
#include <iomanip>
#include <iostream>
#include <vector>
#include <random>
#include <utility>
#include <functional>
#include <limits>
#include <numeric>

// ============================================================================
// PART 1: Diamond PDQ Core (Scalar-First + Hot-Swap to ILP)
// ============================================================================

namespace diamond {

const int INSERTION_SORT_THRESHOLD = 24;
const int NINTHER_THRESHOLD = 128;
const int BLOCK_SIZE = 64; // Cache-friendly block size

// Hardening: Ensure offsets fit in unsigned char
static_assert(BLOCK_SIZE <= 255, "BLOCK_SIZE must fit in unsigned char for offset storage");

// --- Primitives ---

template<typename T>
inline void insertion_sort(T* start, T* end) {
    if (start == end) return;
    for (T* i = start + 1; i < end; ++i) {
        auto val = *i;
        T* j = i;
        while (j > start && *(j - 1) > val) {
            *j = *(j - 1);
            --j;
        }
        *j = val;
    }
}

template<typename T>
inline void insertion_sort_unguarded(T* start, T* end) {
    if (start == end) return;
    for (T* i = start + 1; i < end; ++i) {
        auto val = *i;
        T* j = i;
        while (*(j - 1) > val) {
            *j = *(j - 1);
            --j;
        }
        *j = val;
    }
}

template<typename T>
inline bool partial_insertion_sort(T* start, T* end) {
    int limit = 8;
    for (T* i = start + 1; i < end; ++i) {
        auto val = *i;
        T* j = i;
        while (j > start && *(j - 1) > val) {
            if (limit-- == 0) {
                *j = val; 
                return false;
            }
            *j = *(j - 1);
            --j;
        }
        *j = val;
    }
    return true;
}

template<typename T>
inline void sort3(T* a, T* b, T* c) {
    if (*b < *a) std::swap(*a, *b);
    if (*c < *b) std::swap(*b, *c);
    if (*b < *a) std::swap(*a, *b);
}

// Breaks median-killer patterns
template<typename T>
inline void shuffle_pattern(T* start, T* end) {
    size_t len = end - start;
    size_t k = len / 2;
    if (len > 8) {
        std::swap(start[0], start[k]);
        std::swap(start[len-1], start[k+1]);
    }
}

// --- 3-WAY PARTITION ---
template<typename T>
inline std::pair<T*, T*> partition_3way(T* p, T* r) {
    T pivot = *p;
    T* i = p;     
    T* j = p;     
    T* k = r;     

    while (j <= k) {
        if (*j < pivot) {
            std::swap(*i, *j);
            i++;
            j++;
        } else if (*j > pivot) {
            std::swap(*j, *k);
            k--;
        } else {
            j++;
        }
    }
    return {i, k};
}

template<typename T>
inline bool check_and_fix_run(T* p, T* r) {
    size_t n = r - p + 1;
    if (n < 4) return false;
    bool ascending = true;
    bool descending = true;
    for (int k = 0; k < 3; k++) {
        if (p[k] > p[k+1]) ascending = false;
        if (p[k] < p[k+1]) descending = false;
    }
    if (!ascending && !descending) return false;
    if (ascending) {
        T* scanner = p + 1;
        while (scanner <= r && *(scanner - 1) <= *scanner) scanner++;
        if (scanner > r) return true; 
    } else if (descending) {
        T* scanner = p + 1;
        while (scanner <= r && *(scanner - 1) >= *scanner) scanner++;
        if (scanner > r) {
            std::reverse(p, r + 1);
            return true;
        }
    }
    return false;
}

// --- SCALAR FIRST -> BLOCK UPGRADE PARTITION ---
template<typename T>
inline std::pair<T*, bool> partition_adaptive(T* start, T* end) {
    T pivot = *start;
    T* i = start + 1;
    T* j = end;

    // We start assuming the data is structured (Scalar Mode).
    // This allows branch prediction to do the heavy lifting on Sawtooth/Sorted.
    int entropy_budget = 24; // If we swap this many times, data is Random.
    bool any_swaps = false;

    // --- PHASE 1: SCALAR PROBE ---
    while (true) {
        while (i <= j && *i < pivot) i++;
        while (j > start && *j > pivot) j--; 

        if (i >= j) break; 

        std::swap(*i, *j);
        i++; j--;
        any_swaps = true;

        if (--entropy_budget == 0) {
            // Data is random! Switch to high-throughput Block Mode.
            // But only if enough data is left to justify it.
            if ((j - i) > 2 * BLOCK_SIZE) {
                goto block_mode;
            }
        }
    }
    std::swap(*start, *j);
    return {j, !any_swaps};

block_mode:
    // --- PHASE 2: BLOCK ILP MODE ---
    // Optimizes for Random data. 
    
    unsigned char l_offsets[BLOCK_SIZE]; 
    unsigned char r_offsets[BLOCK_SIZE];

    while (true) {
        if (j - i < 2 * BLOCK_SIZE) goto scalar_cleanup;

        // ILP Unrolled Buffer Fill
        unsigned char* l_curr = l_offsets;
        {
            int k = 0;
            for (; k + 4 <= BLOCK_SIZE; k += 4) {
                *l_curr = k;     l_curr += (i[k]   > pivot);
                *l_curr = k + 1; l_curr += (i[k+1] > pivot);
                *l_curr = k + 2; l_curr += (i[k+2] > pivot);
                *l_curr = k + 3; l_curr += (i[k+3] > pivot);
            }
            for (; k < BLOCK_SIZE; ++k) {
                *l_curr = k; l_curr += (i[k] > pivot); 
            }
        }
        
        unsigned char* r_curr = r_offsets;
        {
            int k = 0;
            for (; k + 4 <= BLOCK_SIZE; k += 4) {
                *r_curr = k;     r_curr += (j[-k]     < pivot);
                *r_curr = k + 1; r_curr += (j[-(k+1)] < pivot);
                *r_curr = k + 2; r_curr += (j[-(k+2)] < pivot);
                *r_curr = k + 3; r_curr += (j[-(k+3)] < pivot);
            }
            for (; k < BLOCK_SIZE; ++k) {
                *r_curr = k; r_curr += (j[-k] < pivot); 
            }
        }

        int l_count = l_curr - l_offsets;
        int r_count = r_curr - r_offsets;

        int swaps = std::min(l_count, r_count);
        for (int k = 0; k < swaps; ++k) {
            std::swap(i[l_offsets[k]], j[-r_offsets[k]]);
        }
        
        i += BLOCK_SIZE;
        j -= BLOCK_SIZE;

        if (l_count != r_count) {
            if (l_count > r_count) i -= BLOCK_SIZE;
            else j += BLOCK_SIZE;
        }
    }

scalar_cleanup:
    while (true) {
        while (i <= j && *i < pivot) i++;
        while (j > start && *j > pivot) j--; 
        if (i >= j) break;
        std::swap(*i, *j);
        i++; j--;
    }
    std::swap(*start, *j);
    return {j, false}; // We definitely swapped if we reached block mode
}

// --- Main Loop ---
template<typename T>
void pdq_loop(T* p, T* r, int limit, int badAllowed, bool leftmost = true) {
    while (true) {
        size_t n = r - p + 1;

        if (n <= INSERTION_SORT_THRESHOLD) {
            if (leftmost) insertion_sort(p, p + n);
            else insertion_sort_unguarded(p, p + n);
            return;
        }
        
        if (badAllowed == 8) { 
             if (check_and_fix_run(p, r)) return;
        }

        // FIX: Check <= 0 to handle double-decrements safely
        if (limit <= 0) {
            std::make_heap(p, r + 1);
            std::sort_heap(p, r + 1);
            return;
        }

        T* mid = p + (n >> 1);
        if (n > NINTHER_THRESHOLD) {
             size_t s = n >> 3;
             sort3(p, p + s, p + 2 * s);
             sort3(mid - s, mid, mid + s);
             sort3(r - 2 * s, r - s, r);
             sort3(p + s, mid, r - s);
        } else {
             sort3(p, mid, r);
        }

        if (*p == *r) {
            auto range = partition_3way(p, r);
            if (range.first > p) pdq_loop(p, range.first - 1, limit - 1, badAllowed, leftmost);
            p = range.second + 1; 
            leftmost = false; 
            // Loop automatically handles tail recursion, 'limit' stays same for this level 
            // (but effectively reduced for next iter as it's a new depth)
            limit--;
            continue;
        }

        std::swap(*p, *mid);
        auto res = partition_adaptive(p, r);
        T* pivotIdx = res.first;
        bool wasClean = res.second;

        if (wasClean) {
            if (partial_insertion_sort(p, pivotIdx) && partial_insertion_sort(pivotIdx + 1, r + 1)) return;
        }

        size_t leftLen = (pivotIdx > p) ? pivotIdx - p : 0;
        size_t rightLen = (r > pivotIdx) ? r - pivotIdx : 0;
        
        if (leftLen < (n >> 3) || rightLen < (n >> 3)) {
            badAllowed--; 
            if (badAllowed == 0) {
                shuffle_pattern(p, r + 1);
                badAllowed = 4; 
                continue; 
            }
            limit--; // Penalty for bad partition
        } else {
            if (badAllowed < 8) badAllowed++;
        }
        
        // Standard recursion depth decrement
        limit--;

        if (leftLen < rightLen) {
            if (leftLen > 0) pdq_loop(p, pivotIdx - 1, limit, badAllowed, leftmost);
            p = pivotIdx + 1;
            leftmost = false;
        } else {
            if (rightLen > 0) pdq_loop(pivotIdx + 1, r, limit, badAllowed, false);
            r = pivotIdx - 1;
        }
        if (p >= r) return;
    }
}

template<typename T>
void sort(T* start, T* end) {
    if (start >= end) return;
    int maxDepth = 2 * std::log2(end - start + 1);
    if (maxDepth == 0) maxDepth = 1;
    pdq_loop(start, end - 1, maxDepth, 8, true);
}

} // namespace diamond


// ============================================================================
// PART 2: Benchmark Harness
// ============================================================================

enum class PatternType {
    Random, Sorted, ReverseSorted, AlmostSorted, FewUnique, Sawtooth, PipeOrgan      
};

class DataGenerator {
public:
    static std::vector<double> generate(size_t size, PatternType type) {
        std::vector<double> data(size);
        std::random_device rd;
        std::mt19937_64 gen(rd());
        
        switch (type) {
            case PatternType::Random: {
                std::uniform_real_distribution<double> dis(-1e9, 1e9);
                for (auto& val : data) val = dis(gen);
                break;
            }
            case PatternType::Sorted: {
                std::iota(data.begin(), data.end(), 0.0);
                break;
            }
            case PatternType::ReverseSorted: {
                std::iota(data.begin(), data.end(), 0.0);
                std::reverse(data.begin(), data.end());
                break;
            }
            case PatternType::AlmostSorted: {
                std::iota(data.begin(), data.end(), 0.0);
                std::uniform_int_distribution<size_t> disIndex(0, size - 1);
                size_t swaps = std::max((size_t)1, (size_t)(size * 0.01));
                for (size_t i = 0; i < swaps; ++i) {
                    std::swap(data[disIndex(gen)], data[disIndex(gen)]);
                }
                break;
            }
            case PatternType::FewUnique: {
                std::uniform_int_distribution<int> disSmall(0, 4); 
                for (auto& val : data) val = static_cast<double>(disSmall(gen));
                break;
            }
            case PatternType::Sawtooth: {
                 size_t step = size / 10; 
                 if (step == 0) step = 1;
                 for(size_t i = 0; i < size; ++i) {
                     size_t val = (i % (step * 2));
                     if (val > step) val = (step * 2) - val;
                     data[i] = static_cast<double>(val);
                 }
                 break;
            }
            case PatternType::PipeOrgan: {
                 for (size_t i = 0; i < size / 2; ++i) data[i] = (double)i;
                 for (size_t i = size / 2; i < size; ++i) data[i] = (double)(size - i);
                 break;
            }
        }
        return data;
    }
};

void sort_std_pure(std::vector<double>& vec) {
    std::sort(vec.begin(), vec.end());
}

void sort_diamond_pure(std::vector<double>& vec) {
    diamond::sort(vec.data(), vec.data() + vec.size());
}

void run_scenario(const std::string& label, PatternType mode, size_t n) {
    std::cout << "\n--- Scenario: " << label << " ---\n";
    auto original = DataGenerator::generate(n, mode);
    
    struct Sorter { std::string name; void (*func)(std::vector<double>&); };
    Sorter sorters[] = {
        {"1. std::sort",     sort_std_pure},
        {"2. Diamond Pure",  sort_diamond_pure}
    };

    for (const auto& s : sorters) {
        std::vector<double> copy = original;
        auto start = std::chrono::high_resolution_clock::now();
        s.func(copy);
        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> ms = end - start;
        bool pass = std::is_sorted(copy.begin(), copy.end());
        
        std::cout << std::left << std::setw(20) << s.name 
                  << ": " << std::fixed << std::setprecision(2) << ms.count() << " ms"
                  << " | " << (pass ? "PASS" : "FAIL") << std::endl;
    }
}

int main(int argc, char** argv) {
    size_t N = 10'000'000;
    if(argc > 1) N = std::stoull(argv[1]);

    std::cout << "Benchmarking N = " << N << " (Scalar Start + Hot-Swap ILP)\n"
              << "==============================================================\n";

    run_scenario("Random Data",     PatternType::Random,        N);
    run_scenario("Already Sorted",  PatternType::Sorted,        N);
    run_scenario("Reverse Sorted",  PatternType::ReverseSorted, N);
    run_scenario("Almost Sorted",   PatternType::AlmostSorted,  N);
    run_scenario("Few Unique",      PatternType::FewUnique,     N);
    run_scenario("Sawtooth",        PatternType::Sawtooth,      N);
    run_scenario("Pipe Organ",      PatternType::PipeOrgan,     N);

    return 0;
}
