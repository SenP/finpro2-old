import { Subscription } from 'rxjs/Rx';
import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Watchlist, WatchlistItem, WatchlistService, QuoteService } from '../common';
import { FPChartComponent, TopstocksComponent } from './index';

@Component({
    selector: 'fp-dashboard',
    templateUrl: 'app/dashboard/dashboard.component.html',
    styles: [`               
                .chart-title {
                    background: lightgrey;
                    line-height: 1.5em;
                    display: flex;
                    text-align: center;
                    justify-content: center;  
                } 
                .chart-panel {
                    padding-right: 5px;
                }            
        `]
})

export class DashboardComponent implements OnInit, OnDestroy {

    @Input() watchlists: Watchlist[] = [];

    // Chart components
    @ViewChild('daychangeChart') daychangeChart: FPChartComponent;
    @ViewChild('marketvalueChart') marketvalueChart: FPChartComponent;
    @ViewChild('pnlChart') pnlChart: FPChartComponent;

    //Topstocks tables
    @ViewChild('topMV') topMV: TopstocksComponent;
    @ViewChild('topPL') topPL: TopstocksComponent;
    @ViewChild('topDC') topDC: TopstocksComponent;

    // Chart option objects    
    optionsDaychangeChart;
    optionsPnLChart;
    optionsMarketValueChart;
    chartData;

    // Portfolio values
    portfolioDaychange = 0;
    portfolioPnL = 0;
    portfolioValue = 0;

    // Refresh scheduler
    refTimerSub: Subscription;

    // All stocks
    allStocks: Map<string, WatchlistItem[]>;

    constructor(private watchlistService: WatchlistService,
        private quoteService: QuoteService) { }

    ngOnInit() {
        // set initial chart data & options and update the dashboard        
        this.initChartData();
        this.setChartOptions();
        this.updateDashboard();

        //subscribe to refresh scheduler and update dashboard at specified interval
        this.refTimerSub = this.quoteService
            .getTimer()
            .subscribe(() => {
                this.updateDashboard();
            });
    }

    ngOnDestroy() {
        this.refTimerSub.unsubscribe();
    }

    // recompute portfolio values, update charts with latest watchlist values 
    updateDashboard() {
        let idx = 0;
        let portfolioValue = 0;
        let portfolioPnL = 0;
        let portfolioDaychange = 0;
        let stocks = new Map<string, WatchlistItem[]>();

        this.watchlists.forEach(wl => {
            let totalDayChange = wl.totalDayChange;
            let totalMarketValue = wl.totalMarketValue;
            let totalPnL = wl.totalPnL;

            //update the charts with new values
            this.daychangeChart.updateData(idx, totalDayChange);
            this.marketvalueChart.updateData(idx, totalMarketValue);
            this.pnlChart.updateData(idx, totalPnL);

            //update portfolio values
            portfolioValue += totalMarketValue;
            portfolioPnL += totalPnL;
            portfolioDaychange += totalDayChange;
            
            // update all stocks map
            wl.instruments.forEach(ins => {
                let stk = stocks.get(ins.instrument + ':' + ins.exchange);
                stk ? stk.push(ins) : stocks.set(ins.instrument + ':' + ins.exchange, [ins]);
            });

            idx += 1;
        });
        this.portfolioValue = portfolioValue;
        this.portfolioPnL = portfolioPnL;
        this.portfolioDaychange = portfolioDaychange;
        //update allstocks list
        this.allStocks = stocks;
    }

    // compute initial chart values
    initChartData() {
        this.portfolioDaychange, this.portfolioPnL, this.portfolioValue = 0;
        let chartData = {
            dataLabels: [],
            marketValues: [],
            pnlValues: [],
            daychangeValues: []
        };

        this.watchlists.forEach(wl => {
            chartData.dataLabels.push(wl.name);

            chartData.marketValues.push([wl.name, wl.totalMarketValue]);
            chartData.pnlValues.push(wl.totalPnL);
            chartData.daychangeValues.push(wl.totalDayChange);

            this.portfolioValue += wl.totalMarketValue;
            this.portfolioPnL += wl.totalPnL;
            this.portfolioDaychange += wl.totalDayChange;
        });
        this.chartData = chartData;
    }

    // set the chart display options
    setChartOptions() {

        let tooltipFn = (txt) => '<strong>{x}</strong><br/> ' + txt + '<b>${point.y}</b>';

        let chartStyle = { "font-family": "Lato,'Helvetica Neue', Helvetica, Arial,'sans-serif'" };

        let optionsBaseChart = {
            title: {
                text: null,
            },
            xAxis: {
                categories: this.chartData.dataLabels
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: true
            }
        };

        this.optionsPnLChart = {
            chart: {
                type: 'column',
                style: chartStyle
            },
            series: [{
                data: this.chartData.pnlValues,
                dataLabels: { enabled: true, format: '${y}' },
                tooltip: { pointFormat: tooltipFn('Net P/L:') },
                color: 'green',
                negativeColor: 'red'
            }]
        };
        this.optionsPnLChart = Object.assign({}, optionsBaseChart, this.optionsPnLChart);

        this.optionsDaychangeChart = {
            chart: {
                type: 'column',
                style: chartStyle
            },
            series: [{
                data: this.chartData.daychangeValues,
                dataLabels: { enabled: true, format: '${y}' },
                tooltip: { pointFormat: tooltipFn('Day Change:') },
                color: 'green',
                negativeColor: 'red'
            }]
        };
        this.optionsDaychangeChart = Object.assign({}, optionsBaseChart, this.optionsDaychangeChart);

        this.optionsMarketValueChart = {
            chart: {
                type: 'pie',
                style: chartStyle
            },
            plotOptions: {
                pie: {
                    innerSize: '40%',
                    center: ['50%', '50%'],
                    borderColor: null
                }
            },
            series: [{
                data: this.chartData.marketValues,
                dataLabels: {
                    enabled: true, format: '{key}<br><b>${y}</b>',
                    distance: 15,
                    connectorPadding: 5,
                    connectorWidth: 2
                },
                tooltip: { pointFormat: tooltipFn('Market Value:') }
            }]
        };
        this.optionsMarketValueChart = Object.assign({}, optionsBaseChart, this.optionsMarketValueChart);
    }
}