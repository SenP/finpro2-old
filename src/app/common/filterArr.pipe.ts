import { Pipe, PipeTransform } from '@angular/core';

// Pipe to filter top/bottom N objects in the given array based on the given order by property

@Pipe({ name: 'fp-filter' })
export class FilterArrPipe implements PipeTransform {

  transform(value: Object[], prop: string, itemsCount = 5, order: string = 'dsc'): Array<Object> {
    
    if (!value || value.length === 0 || !prop ) return [];

    var list = value;
    
    // temporary array holds objects with position and sort-value
    var mapped = list.map(function (el, i) {
      return { index: i, value: el[prop] };
    })
    
    // sorting the mapped array containing the reduced values
    mapped.sort(function (a, b) {
      return a.value - b.value;
    });
    
    // container for the resulting order
    var inputArr = mapped.map(function (el) {
      return list[el.index];
    })

    return order === 'asc' ? inputArr.slice(0, itemsCount) : inputArr.reverse().slice(0, itemsCount);
  }
}
