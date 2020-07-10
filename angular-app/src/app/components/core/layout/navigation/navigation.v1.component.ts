/*
 *  Copyright 2020 Adobe
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {Component, HostBinding, Input} from "@angular/core";
import {AbstractRoutedCoreComponent, RoutedCoreComponentModel} from "../../AbstractRoutedCoreComponent";

export interface NavigationV1Item extends RoutedCoreComponentModel{
    level: number,
    active: boolean,
    title: string,
    url: string,
    lastModified: number,
    description?: string,
    path: string,
    children?: NavigationV1Item[]
}

export interface NavigationV1Model extends RoutedCoreComponentModel{
    items:NavigationV1Item[]
    accessibilityLabel?: string
}

export function NavigationV1IsEmptyFn(props:NavigationV1Model): boolean{
    return props.items == null || props.items.length === 0;
}


@Component({
    selector: 'core-navigation-v1',
    templateUrl: './navigation.v1.component.html'
})
export class NavigationV1Component extends AbstractRoutedCoreComponent implements NavigationV1Model {
    @HostBinding('class') class = 'cmp-title';

    @Input() items: NavigationV1Item[];
    @Input() accessibilityLabel;

    get isEmpty(): boolean {
        return NavigationV1IsEmptyFn(this);
    }

    getItemCssClass(item:NavigationV1Item):string{
        const active:string = item.active ? ` ${this.class}__item--active`: '';
        const level:string = ` ${this.class}__item--level-${item.level}`;
        return `${this.class}__item${active}${level}`;
    }
}