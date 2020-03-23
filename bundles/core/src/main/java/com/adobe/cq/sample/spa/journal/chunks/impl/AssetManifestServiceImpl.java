package com.adobe.cq.sample.spa.journal.chunks.impl;

import com.adobe.cq.sample.spa.journal.chunks.AssetManifestService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.tika.io.IOUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;


@Component(service = AssetManifestService.class)
public class AssetManifestServiceImpl implements AssetManifestService {
    
    private static final String PATH_REACT_MANIFEST = "/apps/we-retail-journal/clientlibs/clientlib-site/resources/asset-manifest.json";
    private static final String PATH_ANGULAR_MANIFEST = "/apps/we-retail-journal/clientlibs/clientlib-site-angular/resources/asset-manifest.json";
    
    @Override
    public Map<String,String> getManifest(SlingHttpServletRequest request) throws IOException {
        
            final Resource assetManifestResource;
            
            if(request.getResource().getPath().startsWith("/content/we-retail-journal/angular")){
                assetManifestResource = request.getResourceResolver().getResource(PATH_ANGULAR_MANIFEST);
            }else{
                assetManifestResource = request.getResourceResolver().getResource(PATH_REACT_MANIFEST);
            }
    
            if(assetManifestResource != null){
                InputStream file = assetManifestResource.adaptTo(InputStream.class);
                String fileString = IOUtils.toString(file);
                ObjectMapper objectMapper = new ObjectMapper();
                return objectMapper.readValue(fileString, new TypeReference<Map<String, String>>() {});
            }else{
                throw new IOException("Could not load manifest file!");
            }
        
        
        
    }
    
    
    
}
