import {Component, Input} from "@angular/core";
import {AbstractCoreComponent} from "../../../AbstractCoreComponent";

export interface ListV2Item {
    url?:string
    lastModified?:number
    lastModifiedFormatted?:string
    description?:string
    path:string
    title:string
}


export interface ListV2Model{
    items:ListV2Item[]
    dateFormatString: string
    showDescription: boolean
    showModificationDate: boolean
    linkItems: boolean
}

export function ListV2IsEmptyFn(props:ListV2Model): boolean{
    return props.items == null || props.items.length === 0;
}


@Component({
    selector: 'core-list-v2',
    templateUrl: './list.v2.component.html',
})
export class ListV2Component extends AbstractCoreComponent implements ListV2Model{

    class = 'cmp-image';

    @Input() items:ListV2Item[];
    @Input() dateFormatString: string;
    @Input() showDescription: boolean;
    @Input() showModificationDate: boolean;
    @Input() linkItems: boolean;

    get isEmpty(): boolean {
        return ListV2IsEmptyFn(this);
    }
}