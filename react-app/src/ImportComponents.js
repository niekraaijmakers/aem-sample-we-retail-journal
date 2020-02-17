/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
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
import {MapTo, withComponentMappingContext} from "@adobe/cq-react-editable-components";
import editConfigs from "./editConfigs";
import withAsyncImport from "./withAsyncImport";

import Navigation from "./components/Navigation";
import AppPage from "./components/Page";
import {withRoute} from "./RouteHelper";

const Text = withAsyncImport(() => import(/* webpackChunkName: "core" */ './components/Text'));
const Image = withAsyncImport(() => import(/* webpackChunkName: "core" */ './components/Image'));
const Weather = withAsyncImport(() => import(/* webpackChunkName: "weather" */ './components/Weather'));

MapTo('we-retail-journal/react/components/structure/page')(withComponentMappingContext(withRoute(AppPage)));

MapTo('we-retail-journal/components/text')(Text, editConfigs.text);
MapTo('we-retail-journal/components/image')(Image, editConfigs.image);
MapTo("we-retail-journal/components/navigation")(Navigation);
MapTo('we-retail-journal/components/weather')(Weather, editConfigs.weather);
