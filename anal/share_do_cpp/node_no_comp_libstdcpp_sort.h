// Algorithm implementation -*- C++ -*-
// Sorting-only extract from stl_algo.h

// Copyright (C) 2001-2025 Free Software Foundation, Inc.
//
// This file is part of the GNU ISO C++ Library.  This library is free
// software; you can redistribute it and/or modify it under the
// terms of the GNU General Public License as published by the
// Free Software Foundation; either version 3, or (at your option)
// any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// Under Section 7 of GPL version 3, you are granted additional
// permissions described in the GCC Runtime Library Exception, version
// 3.1, as published by the Free Software Foundation.

// You should have received a copy of the GNU General Public License and
// a copy of the GCC Runtime Library Exception along with this program;
// see the files COPYING3 and COPYING.RUNTIME respectively.  If not, see
// <http://www.gnu.org/licenses/>.

/*
 *
 * Copyright (c) 1994
 * Hewlett-Packard Company
 *
 * Permission to use, copy, modify, distribute and sell this software
 * and its documentation for any purpose is hereby granted without fee,
 * provided that the above copyright notice appear in all copies and
 * that both that copyright notice and this permission notice appear
 * in supporting documentation.  Hewlett-Packard Company makes no
 * representations about the suitability of this software for any
 * purpose.  It is provided "as is" without express or implied warranty.
 *
 *
 * Copyright (c) 1996
 * Silicon Graphics Computer Systems, Inc.
 *
 * Permission to use, copy, modify, distribute and sell this software
 * and its documentation for any purpose is hereby granted without fee,
 * provided that the above copyright notice appear in all copies and
 * that both that copyright notice and this permission notice appear
 * in supporting documentation.  Silicon Graphics makes no
 * representations about the suitability of this software for any
 * purpose.  It is provided "as is" without express or implied warranty.
 */

 #ifndef _STL_SORT_H
 #define _STL_SORT_H 1
 
 #include <bits/stl_algobase.h>
 #include <bits/stl_heap.h>
 #include <bits/predefined_ops.h>
 
 namespace std _GLIBCXX_VISIBILITY(default)
 {
 _GLIBCXX_BEGIN_NAMESPACE_VERSION
 
   /// Swaps the median value of *__a, *__b and *__c under __comp to *__result
   template<typename _Iterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     void
     __move_median_to_first(_Iterator __result, _Iterator __a, _Iterator __b,
                _Iterator __c, _Compare __comp)
     {
       if (__comp(*__a, *__b))
     {
       if (__comp(*__b, *__c))
         std::iter_swap(__result, __b);
       else if (__comp(*__a, *__c))
         std::iter_swap(__result, __c);
       else
         std::iter_swap(__result, __a);
     }
       else if (__comp(*__a, *__c))
     std::iter_swap(__result, __a);
       else if (__comp(*__b, *__c))
     std::iter_swap(__result, __c);
       else
     std::iter_swap(__result, __b);
     }
 
   /// @cond undocumented
 
   /// This is a helper function for the sort routines.
   template<typename _RandomAccessIterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     void
     __heap_select(_RandomAccessIterator __first,
           _RandomAccessIterator __middle,
           _RandomAccessIterator __last, _Compare __comp)
     {
       std::__make_heap(__first, __middle, __comp);
       for (_RandomAccessIterator __i = __middle; __i < __last; ++__i)
     if (__comp(*__i, *__first))
       std::__pop_heap(__first, __middle, __i, __comp);
     }
 
   /// This is a helper function for the sort routine.
   template<typename _RandomAccessIterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     void
     __unguarded_linear_insert(_RandomAccessIterator __last,
                   _Compare __comp)
     {
       typename iterator_traits<_RandomAccessIterator>::value_type
     __val = _GLIBCXX_MOVE(*__last);
       _RandomAccessIterator __next = __last;
       --__next;
       while (__comp(__val, *__next))
     {
       *__last = _GLIBCXX_MOVE(*__next);
       __last = __next;
       --__next;
     }
       *__last = _GLIBCXX_MOVE(__val);
     }
 
   /// This is a helper function for the sort routine.
   template<typename _RandomAccessIterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     void
     __insertion_sort(_RandomAccessIterator __first,
              _RandomAccessIterator __last, _Compare __comp)
     {
       if (__first == __last)
     return;
 
       typedef iterator_traits<_RandomAccessIterator> _IterTraits;
       typedef typename _IterTraits::difference_type _Dist;
 
       for (_RandomAccessIterator __i = __first + _Dist(1); __i != __last; ++__i)
     {
       if (__comp(*__i, *__first))
         {
           typename _IterTraits::value_type __val = _GLIBCXX_MOVE(*__i);
           _GLIBCXX_MOVE_BACKWARD3(__first, __i, __i + _Dist(1));
           *__first = _GLIBCXX_MOVE(__val);
         }
       else
         std::__unguarded_linear_insert(__i, __comp);
     }
     }
 
   /// This is a helper function for the sort routine.
   template<typename _RandomAccessIterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     inline void
     __unguarded_insertion_sort(_RandomAccessIterator __first,
                    _RandomAccessIterator __last, _Compare __comp)
     {
       for (_RandomAccessIterator __i = __first; __i != __last; ++__i)
     std::__unguarded_linear_insert(__i, __comp);
     }
 
   /**
    *  @doctodo
    *  This controls some aspect of the sort routines.
   */
   enum { _S_threshold = 16 };
 
   /// This is a helper function for the sort routine.
   template<typename _RandomAccessIterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     void
     __final_insertion_sort(_RandomAccessIterator __first,
                _RandomAccessIterator __last, _Compare __comp)
     {
       typename iterator_traits<_RandomAccessIterator>::difference_type
     __threshold = _S_threshold;
 
       if (__last - __first > __threshold)
     {
       std::__insertion_sort(__first, __first + __threshold, __comp);
       std::__unguarded_insertion_sort(__first + __threshold, __last,
                       __comp);
     }
       else
     std::__insertion_sort(__first, __last, __comp);
     }
 
   /// This is a helper function...
   template<typename _RandomAccessIterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     _RandomAccessIterator
     __unguarded_partition(_RandomAccessIterator __first,
               _RandomAccessIterator __last,
               _RandomAccessIterator __pivot, _Compare __comp)
     {
       while (true)
     {
       while (__comp(*__first, *__pivot))
         ++__first;
       --__last;
       while (__comp(*__pivot, *__last))
         --__last;
       if (!(__first < __last))
         return __first;
       std::iter_swap(__first, __last);
       ++__first;
     }
     }
 
   /// This is a helper function...
   template<typename _RandomAccessIterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     inline _RandomAccessIterator
     __unguarded_partition_pivot(_RandomAccessIterator __first,
                 _RandomAccessIterator __last, _Compare __comp)
     {
       typedef iterator_traits<_RandomAccessIterator> _IterTraits;
       typedef typename _IterTraits::difference_type _Dist;
 
       _RandomAccessIterator __mid = __first + _Dist((__last - __first) / 2);
       _RandomAccessIterator __second = __first + _Dist(1);
       std::__move_median_to_first(__first, __second, __mid, __last - _Dist(1),
                   __comp);
       return std::__unguarded_partition(__second, __last, __first, __comp);
     }
 
   template<typename _RandomAccessIterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     inline void
     __partial_sort(_RandomAccessIterator __first,
            _RandomAccessIterator __middle,
            _RandomAccessIterator __last,
            _Compare __comp)
     {
       std::__heap_select(__first, __middle, __last, __comp);
       std::__sort_heap(__first, __middle, __comp);
     }
 
   /// This is a helper function for the sort routine.
   template<typename _RandomAccessIterator, typename _Size, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     void
     __introsort_loop(_RandomAccessIterator __first,
              _RandomAccessIterator __last,
              _Size __depth_limit, _Compare __comp)
     {
       while (__last - __first > int(_S_threshold))
     {
       if (__depth_limit == 0)
         {
           std::__partial_sort(__first, __last, __last, __comp);
           return;
         }
       --__depth_limit;
       _RandomAccessIterator __cut =
         std::__unguarded_partition_pivot(__first, __last, __comp);
       std::__introsort_loop(__cut, __last, __depth_limit, __comp);
       __last = __cut;
     }
     }
 
   // sort
 
   template<typename _RandomAccessIterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     inline void
     __sort(_RandomAccessIterator __first, _RandomAccessIterator __last,
        _Compare __comp)
     {
       if (__first != __last)
     {
       std::__introsort_loop(__first, __last,
                 std::__lg(__last - __first) * 2,
                 __comp);
       std::__final_insertion_sort(__first, __last, __comp);
     }
     }
 
   /// @endcond
 
 _GLIBCXX_BEGIN_NAMESPACE_ALGO
 
   /**
    *  @brief Sort the elements of a sequence.
    *  @ingroup sorting_algorithms
    *  @param  __first   An iterator.
    *  @param  __last    Another iterator.
    *  @return  Nothing.
    *
    *  Sorts the elements in the range `[__first, __last)` in ascending order,
    *  such that for each iterator `i` in the range `[__first, __last - 1)`,
    *  `*(i+1) < *i` is false.
    *
    *  The relative ordering of equivalent elements is not preserved, use
    *  `stable_sort()` if this is needed.
   */
   template<typename _RandomAccessIterator>
     _GLIBCXX20_CONSTEXPR
     inline void
     sort(_RandomAccessIterator __first, _RandomAccessIterator __last)
     {
       // concept requirements
       __glibcxx_function_requires(_Mutable_RandomAccessIteratorConcept<
         _RandomAccessIterator>)
       __glibcxx_function_requires(_LessThanComparableConcept<
         typename iterator_traits<_RandomAccessIterator>::value_type>)
       __glibcxx_requires_valid_range(__first, __last);
       __glibcxx_requires_irreflexive(__first, __last);
 
       std::__sort(__first, __last, __gnu_cxx::__ops::less());
     }
 
   /**
    *  @brief Sort the elements of a sequence using a predicate for comparison.
    *  @ingroup sorting_algorithms
    *  @param  __first   An iterator.
    *  @param  __last    Another iterator.
    *  @param  __comp    A comparison functor.
    *  @return  Nothing.
    *
    *  Sorts the elements in the range `[__first, __last)` in ascending order,
    *  such that `__comp(*(i+1), *i)` is false for every iterator `i` in the
    *  range `[__first, __last - 1)`.
    *
    *  The relative ordering of equivalent elements is not preserved, use
    *  `stable_sort()` if this is needed.
   */
   template<typename _RandomAccessIterator, typename _Compare>
     _GLIBCXX20_CONSTEXPR
     inline void
     sort(_RandomAccessIterator __first, _RandomAccessIterator __last,
      _Compare __comp)
     {
       // concept requirements
       __glibcxx_function_requires(_Mutable_RandomAccessIteratorConcept<
         _RandomAccessIterator>)
       __glibcxx_function_requires(_BinaryPredicateConcept<_Compare,
         typename iterator_traits<_RandomAccessIterator>::value_type,
         typename iterator_traits<_RandomAccessIterator>::value_type>)
       __glibcxx_requires_valid_range(__first, __last);
       __glibcxx_requires_irreflexive_pred(__first, __last, __comp);
 
       std::__sort(__first, __last, __comp);
     }
 
 _GLIBCXX_END_NAMESPACE_ALGO
 _GLIBCXX_END_NAMESPACE_VERSION
 } // namespace std
 
 #endif /* _STL_SORT_H */