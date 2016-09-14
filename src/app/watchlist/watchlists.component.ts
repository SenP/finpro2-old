import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Watchlist, WatchlistService } from '../common';

@Component({
    selector: 'fp-watchlists',
    templateUrl: 'app/watchlist/watchlists.component.html',
    styles: [`      
            .msg {
                    font-style: italic;
                    font-size: 1.25em;
                }   
        `]
})

export class WatchlistsComponent {

    @Input() watchlists: Watchlist[] = [];
    @Output() changeSelection = new EventEmitter();
    @ViewChild('editName') editName;

    selectedWatchlist: Watchlist;
    editedItem: Watchlist;
    isEditing: boolean = false;
    isAdding: boolean = false;
    isDeleting: boolean = false;

    msg: string = null;
    msgClass: string;
    msgClasses = {
        error: "msg text-danger",
        info: "msg text-info"
    }

    constructor(private watchlistService: WatchlistService) { }

    onChangeSelection(wl) {
        this.selectedWatchlist = wl;
        this.changeSelection.emit(wl);
    }

    addWatchlist() {
        this.editedItem = new Watchlist();
        this.isAdding = true;
        setTimeout(() => this.editName.nativeElement.focus(), 100);
    }

    editWatchlist() {
        this.editedItem = Object.assign(new Watchlist(), this.selectedWatchlist);
        this.isEditing = true;
        setTimeout(() => this.editName.nativeElement.focus(), 100);
    }

    saveWatchlist() {
        this.msg = "Saving...please wait."
        this.msgClass = this.msgClasses.info;
        this.watchlistService
            .saveWatchlist(this.editedItem)
            .then(res => {
                if (res.status === "error") {
                    this.msg = res.msg;
                    this.msgClass = this.msgClasses.error;
                }
                else {
                    this.resetView();
                    this.onChangeSelection(res.data);
                }
            });
    }

    deleteWatchlist() {
        if (confirm('Delete ' + this.selectedWatchlist.name + ' watchlist?')) {
            this.isDeleting = true;
            this.msg = "Deleting...please wait.";
            this.msgClass = this.msgClasses.info;
            let delidx = this.watchlists.findIndex(wl => wl.id === this.selectedWatchlist.id);
            this.watchlistService
                .deleteWatchlist(this.selectedWatchlist)
                .then(res => {
                    this.resetView();
                    //reset selected watchlist
                    if (this.watchlists.length === 0) { // last watchlist deleted
                        this.onChangeSelection(null); //return to dashboard
                    }
                    else { //select new last wl if last wl is deleted or next wl if any other wl is deleted
                        let newidx = delidx === this.watchlists.length ? delidx - 1 : delidx;
                        this.onChangeSelection(this.watchlists[newidx]);
                    }
                });
        }
    }

    resetView() {
        this.editedItem = null;
        this.isEditing = false;
        this.isAdding = false;
        this.isDeleting = false;
        this.msg = "";
        this.msgClass = "";
    }
}
