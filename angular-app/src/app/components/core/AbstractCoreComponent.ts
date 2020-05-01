import {MappedComponentProperties} from "./common";
import {Input} from "@angular/core";

export interface CoreComponentModel {
    hidePlaceHolder: boolean
    isInEditor:boolean
}

export abstract class AbstractCoreComponent implements MappedComponentProperties{
    hidePlaceHolder: boolean = false;
    @Input() isInEditor: boolean = false;
    @Input() cqForceReload: boolean = false;
    @Input() cqPath: string;

    class: string;

    /**
     * Method that needs to be overloaded, to determine whether the component should be treated as 'empty'
     */
    public abstract get isEmpty():boolean;

    public shouldShowPlaceHolder():boolean {
        return (this.isEmpty && this.isInEditor === true && this.hidePlaceHolder !== false);
    }

}