import {Component, HostBinding, Input} from "@angular/core";
import {AbstractCoreComponent} from "../../../AbstractCoreComponent";

export function TeaserV1IsEmptyFn(props:TeaserV1Model): boolean{
    return (!props.imagePath && !props.description &&  props.actions.length == 0)
}

export interface TeaserV1Action {
    title: string
    URL: string;
}

export interface TeaserV1Model{
    pretitle?: string
    title?: string
    description?: string
    titleType: string
    linkURL: string
    actionsEnabled: boolean
    imageLinkHidden: boolean
    titleLinkHidden: boolean
    actions: TeaserV1Action[]
    imagePath: string
}


@Component({
    selector: 'core-teaser-v1',
    templateUrl: './teaser.v1.component.html',
})
export class TeaserV1Component extends AbstractCoreComponent implements TeaserV1Model{

    @HostBinding('class') class = 'cmp-teaser';

    @Input() pretitle?: string;
    @Input() title?: string;
    @Input() description?: string;
    @Input() titleType: string;
    @Input() linkURL: string;
    @Input() actionsEnabled: boolean = false;
    @Input() imageLinkHidden: boolean;
    @Input() titleLinkHidden: boolean;
    @Input() actions: TeaserV1Action[];
    @Input() imagePath: string;

    get isEmpty(): boolean {
        return TeaserV1IsEmptyFn(this);
    }
}