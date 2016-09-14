import { Component, OnChanges, Input } from '@angular/core';
import { WatchlistItem, FilterArrPipe } from '../common';

@Component({
    selector: 'fp-topstocks',
    templateUrl: 'app/dashboard/topstocks.component.html',
    styles: [`
                .number-field {
                    text-align: center
                }                
                .topTable {
                    background: white
                }                
        `]
})

export class TopstocksComponent implements OnChanges {

    @Input('stocks') allStocks: Map<string, WatchlistItem[]>;
    @Input() title;
    @Input() orderBy;
    @Input() numRequired;
    @Input() sortOrder;

    topStocks: Object[] = [];

    constructor(private filterList: FilterArrPipe) { } 

    ngOnChanges() {
        this.topStocks = this.filterList.transform(this.getFlatList(), this.orderBy, this.numRequired, this.sortOrder);
    }

    getFlatList(): Object[] {
        let flatList = [];
        this.allStocks.forEach((stocks, key) => {
            let [instrument, exchange] = key.split(':');
            let value = 0;
            stocks.forEach(stock => value += stock[this.orderBy]);
            flatList.push({ instrument, exchange, [this.orderBy]: value });
        })
        return flatList;
    }
}
