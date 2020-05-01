import {ComponentMapping, ɵa as AEMAllowedComponentsContainerComponent} from "@adobe/cq-angular-editable-components";
import {HostBinding, Input} from "@angular/core";
import {ContainerModel, ContainerProperties, Model} from "../common";

export function ContainerIsEmptyFn(props:ContainerModel){
    return props[":itemsOrder"] == null || props[":itemsOrder"].length === 0;
}


export abstract class AbstractContainerComponent extends AEMAllowedComponentsContainerComponent implements ContainerProperties{
    @Input() componentMapping: typeof ComponentMapping = ComponentMapping;
    @Input() cqForceReload: boolean = false;
    @Input() isInEditor: boolean = false;
    @Input() cqItems: {[key: string]: Model} = {};
    @Input() cqItemsOrder: string[] = [];

    @HostBinding('class') class;

}
