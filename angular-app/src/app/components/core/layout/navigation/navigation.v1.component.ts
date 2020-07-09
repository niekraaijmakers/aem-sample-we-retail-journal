import {Component, Input} from "@angular/core";
import {AbstractCoreComponent} from "../../AbstractCoreComponent";
import {BreadCrumbV2Model} from "../breadcrumb/v2/breadcrumb.v2.component";

export interface NavigationV1Item {
    level: number,
    active: boolean,
    title: string,
    url: string,
    lastModified: number,
    description?: string,
    path: string,
    children?: NavigationV1Item[]
    routed?:boolean
}

export interface NavigationV1Model{
    items:NavigationV1Item[]
    accessibilityLabel?: string
    routedLinks: boolean
}

export function NavigationV1IsEmptyFn(props:NavigationV1Model): boolean{
    return props.items == null || props.items.length === 0;
}


@Component({
    selector: 'core-navigation-v1',
    templateUrl: './navigation.v1.component.html'
})
export class NavigationV1Component extends AbstractCoreComponent implements NavigationV1Model {
    @Input() items: NavigationV1Item[];
    @Input() accessibilityLabel;
    @Input() routedLinks = false;

    get isEmpty(): boolean {
        return NavigationV1IsEmptyFn(this);
    }

    isNavItemRouted(item:NavigationV1Item):boolean{
        return item.routed || this.routedLinks;
    }
}