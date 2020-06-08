package com.adobe.cq.sample.spa.journal.internal.models;


import com.adobe.acs.commons.synth.Synthesizer;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import java.io.IOException;


@Model(
        // This must adapt from a SlingHttpServletRequest, since this is invoked directly via a request, and not via a resource.
        // If can specify Resource.class as a second adaptable as needed
        adaptables = { SlingHttpServletRequest.class },
        resourceType = "cq:Component",
        // This Model should have the specific Model class (SampleComponentExporter.class)
        // AS WELL AS the ComponentExporter.class. Its required that ComponentExporter.class to be set at an adapter
        // since this how the AEM Content Services JSON Exporter figures out which resources to serialize.
        adapters = { DefaultComponentHTMLExporter.class, ComponentExporter.class },
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
// name = the registered name of the exporter (  ExporterConstants.SLING_MODEL_EXPORTER_NAME => jackson )
// extensions = the extensions this exporter is registered to (ExporterConstants.SLING_MODEL_EXTENSION => json)
// selector = defaults to "model", can override as needed; This is helpful if a single resource needs 2 different JSON renditions.
//            (ExporterConstants.SLING_MODEL_SELECTOR => model)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
        extensions = ExporterConstants.SLING_MODEL_EXTENSION
)
// Mark as JSON Serializable as the Model's class (SampleComponentExporter.class) or interface if those are used.
@JsonSerialize(as = DefaultComponentHTMLExporter.class)
// Make sure the Model implementation implements (or the Model interface extends) com.adobe.cq.export.json.ComponentExporter.
public class DefaultComponentHTMLExporter implements ComponentExporter {
        
        private static final Logger LOGGER = LoggerFactory.getLogger(DefaultComponentHTMLExporter.class);
        
        @Self
        private SlingHttpServletRequest request;
        
        @SlingObject
        private SlingHttpServletResponse response;
        
        
        @Override
        public String getExportedType() {
                return "core/wcm/components/default/v1/default";
        }
        
        @JsonInclude
        public String getHTML(){
                try {
                        return Synthesizer.render(request.getResource(), request, response);
                } catch (ServletException | IOException e) {
                        LOGGER.error("Error rendering resource", e);
                        return "Error rendering resource";
                }
        }
}