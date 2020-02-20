import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LeverageChartDialogComponent } from '../leverage-chart-dialog/leverage-chart-dialog.component';
import { mockedPositions } from './mocked-positions';
import { OneLeverageService } from '../../../one-leverage.service';
import { Web3Service } from '../../../web3.service';

export interface IPosition {
    assetAmount: number;
    initialRates2Usd: number;
    tokenName: string;
    profit: string;
    status: string;
    stopLossUsd: number;
    stopWinUsd: number;
    leverage: number;
    ratesHistory: Array<{ rate: number, t: string }>;
}

@Component({
    selector: 'app-my-positions',
    templateUrl: './my-positions.component.html',
    styleUrls: ['./my-positions.component.scss']
})
export class MyPositionsComponent implements OnInit {
    // TODO: make mocks more stupid,
    //  add parameters calculation, to dot this calcaulation logic to shared service
    positions = mockedPositions;
    modalRef: BsModalRef;
    message: string;

    openPositions;
    closedPositions;

    constructor(
        private modalService: BsModalService,
        private oneLeverageService: OneLeverageService,
        private web3Service: Web3Service
    ) {
        //
    }

    async ngOnInit() {
        // ---

        setTimeout(() => {

            this.web3Service.connectEvent.subscribe(value => {

                this.loadPositions();
            });
        }, 5000);

        this.loadPositions();
    }

    async loadPositions() {

        this.openPositions = await this.oneLeverageService.getOpenPositions(
            this.web3Service.walletAddress
        );

        console.log('openPositions', this.openPositions);

        this.closedPositions = await this.oneLeverageService.getClosedPositions(
            this.web3Service.walletAddress
        );

        console.log('closedPositions', this.closedPositions);
    }

    operate(position: any, template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    confirm(): void {
        this.message = 'Confirmed!';
        this.modalRef.hide();
    }

    decline(): void {
        this.message = 'Declined!';
        this.modalRef.hide();
    }

    showChartDialog(position: IPosition) {
        const initialState: any = {
            ...position,
            src2DstAssetRates: position.ratesHistory.map((x) => x.rate),
            rates2Usd: position.ratesHistory
        };
        //
        this.modalRef = this.modalService.show(LeverageChartDialogComponent, { class: 'modal-lg', initialState });
    }
}
