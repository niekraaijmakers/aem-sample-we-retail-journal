import {Component, HostBinding} from "@angular/core";

export function SeparatorV1IsEmptyFn(): boolean{
    return false;
}
@Component({
    selector: 'core-separator-v1',
    templateUrl: './separator.v1.component.html',
})
export class SeparatorV1 {
    @HostBinding('class') class = 'cmp-separator';
}