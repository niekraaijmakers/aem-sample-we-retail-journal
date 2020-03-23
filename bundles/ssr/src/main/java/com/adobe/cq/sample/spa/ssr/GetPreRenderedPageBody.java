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
package com.adobe.cq.sample.spa.ssr;


import com.adobe.cq.sample.spa.ssr.model.SSRResponse;
import com.adobe.cq.sample.spa.ssr.service.SpaPageBindingsProvider;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.jetbrains.annotations.NotNull;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

@Component(
        service = {Servlet.class},
        property = {
                "sling.servlet.resourceTypes=cq/spa/ssr",
                "sling.servlet.methods=GET"
        }
)
/**
 * Service responsible for fetching Server-Side pre-rendered HTML content
 */
public class GetPreRenderedPageBody extends SlingSafeMethodsServlet {
    
    @Reference
    private SpaPageBindingsProvider pageBindingsProvider;
    
    @Override
    protected void doGet(@NotNull SlingHttpServletRequest request, @NotNull SlingHttpServletResponse response) throws ServletException, IOException {
        if(pageBindingsProvider.isServerSideRenderingActiveForRequest()){
            SSRResponse responseBody = pageBindingsProvider.getServerSideRenderedRequestResult();
            final SSRResponse.Payload payload = responseBody.getPayload();
            response.getWriter().write(payload.getHtml());
        }
      
    }

}
