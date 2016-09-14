import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './navbar';
import { Watchlist, WatchlistItem, WatchlistService, QuoteService, Quote } from './common';

@Component({
    selector: 'finpro-app',
    templateUrl: 'app/app.component.html'    
})

export class AppComponent implements OnInit {

    watchlists: Watchlist[] = [];
    selectedWatchlist: Watchlist;
    refInterval: number = 60;
    refFreqs: number[] =  [10, 20, 30, 40, 50, 60];

    constructor(private watchlistService: WatchlistService,
        private quoteService: QuoteService) { }

    ngOnInit() {
        // Get all watchlist from local storage
        this.watchlists = this.watchlistService.getWatchlists();

        //register all instruments with quote service
        this.watchlists.forEach(wl => {
            wl.instruments.forEach(stock => {
                this.quoteService.register(stock.instrument, stock.exchange);
            });
        });

        // Start quote service and update quotes at refInterval
        this.quoteService
            .init(this.refInterval * 1000)
            .subscribe(qmap => {
                this.watchlistService.updateQuotes(qmap);
            });
            
        // Load the supported tickers
        this.quoteService.getTickers();
    }

    onSelect(wl) {
        // Keep track of current watchlist being displayed, null for dashboard display
        this.selectedWatchlist = wl;
    }

    onChangeTimer() {
        // Reset timer to new interval
        this.quoteService.resetTimer(this.refInterval * 1000);
    }
}
