import {Component, HostBinding, Input} from "@angular/core";
import {AbstractCoreComponent} from "../../../AbstractCoreComponent";

export interface TextV2Model {
    text?: string;
    richText: boolean
}

export function TextV2IsEmptyFn(props:TextV2Model): boolean{
    return props.text == null || props.text.trim().length === 0;
}

@Component({
    selector: 'core-title-v2',
    templateUrl: './text.v2.component.html',
})
export class TextV2 extends AbstractCoreComponent implements TextV2Model {

    @HostBinding('class') class = 'cmp-text';
    @Input() text?: string;
    @Input() richText: boolean = false;

    get isEmpty(): boolean {
        return TextV2IsEmptyFn(this);
    }
}