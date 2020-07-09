/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import {ButtonV1Component, ButtonV1IsEmptyFn} from "./core/authoring/button/v1/button.v1.component";
import { TextComponent } from "./text/text.component";
import { ImageComponent } from "./image/image.component";
import { WeatherComponent } from "./weather/weather.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { MapTo, AEMContainerComponent, AEMResponsiveGridComponent } from "@adobe/cq-angular-editable-components";
import {TabsV2Component} from "./core/containers/tabs/v2/tabs.v2.component";
import {AccordionV1Component} from "./core/containers/accordion/v1/accordion.v1.component";
import {ContainerIsEmptyFn} from "./core/containers/AbstractContainerComponent";
import {CarouselV1Component} from "./core/containers/carousel/v1/carousel.v1.component";
import {ContainerV1Component} from "./core/containers/container/v1/container.v1.component";
import {DefaultV1Component, DefaultV1IsEmptyFn} from "./core/authoring/default/v1/default.v1.component";
import {DownloadV1Component, DownloadV1IsEmptyFn} from "./core/authoring/download/v1/download.v1.component";
import {ImageV2Component, ImageV2IsEmptyFn} from "./core/authoring/image/v2/image.v2.component";
import {SeparatorV1} from "./core/authoring/separator/v1/separator.v1.component";
import {TitleV2} from "./core/authoring/title/v2/title.v2.component";
import {TextV2, TextV2IsEmptyFn} from "./core/authoring/text/v2/text.v2.component";
import {ListV2Component, ListV2IsEmptyFn} from "./core/authoring/list/v2/list.v2.component";
import {TeaserV1Component, TeaserV1IsEmptyFn} from "./core/authoring/teaser/v1/teaser.v1.component";
import {BreadCrumbV2Component, BreadCrumbV2IsEmptyFn} from "./core/layout/breadcrumb/v2/breadcrumb.v2.component";
import {NavigationV1Component, NavigationV1IsEmptyFn} from "./core/layout/navigation/navigation.v1.component";

/**
 * Default Edit configuration for the Image component that interact with the Core Image component and sub-types
 *
 * @type EditConfig
 */
const ImageEditConfig = {

    emptyLabel: 'Image',

    isEmpty: function(cqModel) {
        return !cqModel || !cqModel.src || cqModel.src.trim().length < 1;
    }
};

/**
 * Default Edit configuration for the Text component that interact with the Core Text component and sub-types
 *
 * @type EditConfig
 */
const TextEditConfig = {

    emptyLabel: 'Text',

    isEmpty: function(cqModel) {
        return !cqModel || !cqModel.text || cqModel.text.trim().length < 1;
    }
};


MapTo('core-components-examples/components/navigation')(NavigationV1Component,{emptyLabel:'NavigationV1', isEmpty:NavigationV1IsEmptyFn});
MapTo('core-components-examples/components/breadcrumb')(BreadCrumbV2Component,{emptyLabel:'BreadCrumbV2', isEmpty:BreadCrumbV2IsEmptyFn});
MapTo('core-components-examples/components/list')(ListV2Component,{emptyLabel:'ListV2', isEmpty:ListV2IsEmptyFn});
MapTo('core-components-examples/components/text')(TextV2,{emptyLabel:'TextV2', isEmpty:TextV2IsEmptyFn});
MapTo('core-components-examples/components/title')(TitleV2);
MapTo('core-components-examples/components/teaser')(TeaserV1Component, {emptyLabel:'TeaserV1', isEmpty:TeaserV1IsEmptyFn});
MapTo('core-components-examples/components/separator')(SeparatorV1);
MapTo('core-components-examples/components/image')(ImageV2Component,{emptyLabel:'ImageV2', isEmpty:ImageV2IsEmptyFn});
MapTo('core-components-examples/components/download')(DownloadV1Component,{emptyLabel:'DownloadV1', isEmpty:DownloadV1IsEmptyFn});
MapTo('contrib/wcm/components/container')(ContainerV1Component,{emptyLabel:'ContainerV1', isEmpty:ContainerIsEmptyFn});
MapTo('contrib/wcm/components/carousel')(CarouselV1Component,{emptyLabel:'CarouselV1', isEmpty:ContainerIsEmptyFn});
MapTo('contrib/wcm/components/accordion')(AccordionV1Component, {emptyLabel:'AccordionV1', isEmpty:ContainerIsEmptyFn});
MapTo('contrib/wcm/components/tabs')(TabsV2Component,{emptyLabel:'AccordionV1', isEmpty:ContainerIsEmptyFn});
MapTo('we-retail-journal/components/button')(ButtonV1Component, {emptyLabel: 'ButtonV1', isEmpty:ButtonV1IsEmptyFn});
MapTo('we-retail-journal/components/text')(TextComponent, TextEditConfig);
MapTo('we-retail-journal/components/image')(ImageComponent, ImageEditConfig);
MapTo('wcm/foundation/components/responsivegrid')(AEMResponsiveGridComponent);
MapTo('we-retail-journal/components/weather')(WeatherComponent);
MapTo('we-retail-journal/components/navigation')(NavigationComponent);
MapTo('we-retail-journal/angular/components/structure/app')(AEMContainerComponent);
MapTo('core/wcm/components/default/v1/default')(DefaultV1Component,{emptyLabel:'Default Component', isEmpty:DefaultV1IsEmptyFn});