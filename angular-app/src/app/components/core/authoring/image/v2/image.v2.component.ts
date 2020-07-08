import {AbstractCoreComponent} from "../../../AbstractCoreComponent";
import {Component, HostBinding, Input} from "@angular/core";


export interface ImageV2Model{
    src: string
    alt: string
    displayPopupTitle?: boolean
    title?: string
    link?: string
}

export function ImageV2IsEmptyFn(props:ImageV2Model) {
    return (!props.src) || props.src.length === 0;
}


@Component({
    selector: 'core-image-v2',
    templateUrl: './image.v2.component.html',
})
export class ImageV2Component extends AbstractCoreComponent implements ImageV2Model{

    @HostBinding('class') class = 'cmp-image';

    @Input() src: string;
    @Input() alt: string;
    @Input() displayPopupTitle?: boolean;
    @Input() title?: string;
    @Input() link?: string;


    get ddCssClass(): string {
        return (this.isInEditor) ? 'cq-dd-image' : '';
    }

    get hasTitle(): boolean {
        return !!this.title && this.title.trim().length > 0;
    }

    get hasLink(): boolean{
        return !!this.link && this.link.trim().length > 0;
    }

    get isEmpty(): boolean {
        return ImageV2IsEmptyFn(this);
    }
}