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
import './components/mapping';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {AngularWeatherWidgetModule, WeatherApiName} from 'angular-weather-widget';
import {AppComponent} from './app.component';
import {SpaAngularEditableComponentsModule} from '@adobe/cq-angular-editable-components';
import {ModelManagerService} from './components/model-manager.service';
import {TextComponent} from './components/text/text.component';
import {ImageComponent} from './components/image/image.component';
import {WeatherComponent} from './components/weather/weather.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {MenuComponent} from './components/navigation/menu/menu.component';
import {MainContentComponent} from './components/main-content/main-content.component';
import {AppRoutingModule} from './app-routing.module';
import {ButtonV1Component} from "./components/core/authoring/button/v1/button.v1.component";
import {EditPlaceholderComponent} from "./components/core/editplaceholder/editplaceholder.component";
import {TabsV2Component} from "./components/core/containers/tabs/v2/tabs.v2.component";
import {AccordionV1Component} from "./components/core/containers/accordion/v1/accordion.v1.component";
import {CarouselV1Component} from "./components/core/containers/carousel/v1/carousel.v1.component";
import {ContainerV1Component} from "./components/core/containers/container/v1/container.v1.component";
import {DefaultV1Component} from "./components/core/authoring/default/v1/default.v1.component";
import {SafeHtmlPipe} from "./pipes/safeHtml.pipe";
import {DownloadV1Component} from "./components/core/authoring/download/v1/download.v1.component";
import {ImageV2Component} from "./components/core/authoring/image/v2/image.v2.component";
import {SeparatorV1} from "./components/core/authoring/separator/v1/separator.v1.component";
import {TitleV2} from "./components/core/authoring/title/v2/title.v2.component";
import {TextV2} from "./components/core/authoring/text/v2/text.v2.component";
import {ListV2Component} from "./components/core/authoring/list/v2/list.v2.component";
import {TeaserV1Component} from "./components/core/authoring/teaser/v1/teaser.v1.component";
import {BreadCrumbV2Component} from "./components/core/layout/breadcrumb/v2/breadcrumb.v2.component";
import {NavigationV1Component} from "./components/core/layout/navigation/navigation.v1.component";
import {LanguageNavigationV1Component} from "./components/core/layout/language-navigation/v1/language-navigation.v1.component";
import {
    DefaultNavigationUtilityServiceImpl,
    NAVIGATION_UTIL_SERVICE,
    NavigationUtilityService
} from "./components/core/services/NavigationUtilityService";

export interface NavigationUtilityConfig {
    myService: Type<NavigationUtilityService>;
}

@NgModule({
  imports: [ BrowserModule.withServerTransition({ appId: 'we-retail-sample-angular' }),
    SpaAngularEditableComponentsModule,
    AngularWeatherWidgetModule.forRoot({
      key: "37375c33ca925949d7ba331e52da661a",
      name: WeatherApiName.OPEN_WEATHER_MAP,
      baseUrl: 'http://api.openweathermap.org/data/2.5'
    }),
    AppRoutingModule,
    BrowserTransferStateModule ],
  providers: [
      ModelManagerService,{ provide: APP_BASE_HREF, useValue: '/' } ,
      {provide: NAVIGATION_UTIL_SERVICE, useClass: DefaultNavigationUtilityServiceImpl}
  ],
  declarations: [AppComponent,
      TabsV2Component,
      DownloadV1Component,
      ImageV2Component,
      SeparatorV1,
      BreadCrumbV2Component,
      TitleV2,
      TextV2,
      ListV2Component,
      NavigationV1Component,
      LanguageNavigationV1Component,
      TeaserV1Component,
      AccordionV1Component,
      EditPlaceholderComponent,
      ContainerV1Component,
      ButtonV1Component,
      DefaultV1Component,
      SafeHtmlPipe,
      TextComponent,
      ImageComponent,
      WeatherComponent,
      NavigationComponent,
      CarouselV1Component,
      MenuComponent,
      MainContentComponent],
    entryComponents: [
        DefaultV1Component, ContainerV1Component, CarouselV1Component,
        AccordionV1Component, TabsV2Component, TextComponent, ButtonV1Component,
        EditPlaceholderComponent, ImageComponent, WeatherComponent, NavigationComponent,
        MainContentComponent, DownloadV1Component,ImageV2Component,SeparatorV1,
        TitleV2,TextV2,ListV2Component, TeaserV1Component,
        BreadCrumbV2Component, NavigationV1Component,LanguageNavigationV1Component],
  bootstrap: [ AppComponent ]
})
export class AppModule {
    static forRoot(config?: NavigationUtilityConfig): ModuleWithProviders {
        return {
            ngModule: AppModule,
            providers: [
                ModelManagerService,{ provide: APP_BASE_HREF, useValue: '/' } ,
                {provide: NAVIGATION_UTIL_SERVICE, useClass: config && config.myService || DefaultNavigationUtilityServiceImpl}
            ]
        };
    }
}

