export class WatchlistItem {
    instrument: string;
    exchange: string;
    unitsOwned: number;
    avgPrice: number;
    lastPrice: number;
    change: number;
    percentChange: number;

    get marketValue(): number {
        if (this.unitsOwned > 0 && this.lastPrice > 0) {
            return this.unitsOwned * this.lastPrice;
        }
        return 0;
    }

    get dayChange(): number {
        if (this.unitsOwned && this.change) {
            return this.unitsOwned * this.change;
        }
        return 0;
    }

    get netPnL(): number {
        if (this.unitsOwned && this.avgPrice && this.lastPrice) {
            return this.unitsOwned * (this.lastPrice - this.avgPrice);
        }
        return 0;
    }
}

export class Watchlist {
    id: number;
    name: string;
    description: string;
    owner: string;
    createdOn: Date = new Date();
    instruments: WatchlistItem[];

    get totalMarketValue(): number {
        let total = this.instruments.reduce((totalV, wl) => totalV + wl.marketValue, 0);
        return parseFloat(total.toFixed(2));
    }

    get totalDayChange(): number {
        let total = this.instruments.reduce((totalV, wl) => totalV + wl.dayChange, 0);
        return parseFloat(total.toFixed(2));
    }

    get totalPnL(): number {
        let total = this.instruments.reduce((totalV, wl) => totalV + wl.netPnL, 0);
        return parseFloat(total.toFixed(2));
    }

}