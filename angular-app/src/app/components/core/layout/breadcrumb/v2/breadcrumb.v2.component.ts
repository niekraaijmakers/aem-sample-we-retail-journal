import {Component, HostBinding, Input} from "@angular/core";
import {AbstractCoreComponent} from "../../../AbstractCoreComponent";

export interface BreadCrumbV2ItemModel {
    active: boolean
    url: string
    title: string
}

export interface BreadCrumbV2Model {
    items: BreadCrumbV2ItemModel[]
    routedLinks: boolean
    ariaLabelI18n: string
}

export function BreadCrumbV2IsEmptyFn(props: BreadCrumbV2Model): boolean {
    return props.items == null || props.items.length === 0;
}

@Component({
    selector: 'core-breadcrumb-v2',
    templateUrl: './breadcrumb.v2.component.html'
})
export class BreadCrumbV2Component extends AbstractCoreComponent implements BreadCrumbV2Model {

    @HostBinding('class') class = 'cmp-breadcrumb';

    @Input() items;
    @Input() ariaLabelI18n;
    @Input() routedLinks = true;

    get isEmpty(): boolean {
        return BreadCrumbV2IsEmptyFn(this);
    }

    getItemCssClass(item: BreadCrumbV2ItemModel): string {
        return item.active ? this.class + '__item ' + this.class + '__item--active' : this.class + '__item';
    }
}