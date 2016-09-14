import { Component, Input }        from '@angular/core';
import { ChartComponent } from 'angular2-highcharts';

@Component({
    selector: 'fp-chart',
    styles: [`
                chart {
                    display: block;
                }
            `],
    template: `
                <chart [options]="config" 
                        (load)="saveInstance($event.context)">
                </chart>
            `
})
export class FPChartComponent {
    @Input() config;
    chart: ChartComponent;   

    saveInstance(chartInstance) {
        this.chart = chartInstance;
    }

    updateData(idx, newVal) {
        if (this.chart && this.chart.series[0].data[idx]) {
            let oldVal = this.chart.series[0].data[idx].y;
            if (newVal !== oldVal) {
                setTimeout(() => this.chart.series[0].data[idx].update(newVal), 100);
            }
        }
    }
}

