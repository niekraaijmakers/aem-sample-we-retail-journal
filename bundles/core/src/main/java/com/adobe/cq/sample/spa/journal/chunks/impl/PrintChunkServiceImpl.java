package com.adobe.cq.sample.spa.journal.chunks.impl;


import com.adobe.cq.sample.spa.journal.chunks.AssetManifestService;
import com.adobe.cq.sample.spa.journal.chunks.PrintChunkService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;

@Component(service = PrintChunkService.class)
public class PrintChunkServiceImpl implements PrintChunkService {
    
    private static final Logger log = LoggerFactory.getLogger(PrintChunkServiceImpl.class);
    private static final String SCRIPT_TAG = "\n<script type=\"text/javascript\" src=\"%s\"></script>";
    private static final String CSS_TAG = "\n<link rel=\"stylesheet\" href=\"%s\" type=\"text/css\">";
    
    @Reference
    private AssetManifestService assetManifestService;
    
    @Override
    public void printJsChunkToResponse(String chunkName, SlingHttpServletRequest request, SlingHttpServletResponse response) {
        String tag = getTag(SCRIPT_TAG, ".js", chunkName, request);
        try {
            response.getWriter().println(tag);
        } catch (IOException e) {
           log.error("Error printing js chunk", e);
        }
    }
    
    @Override
    public void printCssChunkToResponse(String chunkName, SlingHttpServletRequest request, SlingHttpServletResponse response) {
        String tag = getTag(CSS_TAG, ".css", chunkName, request);
        try {
            response.getWriter().println(tag);
        } catch (IOException e) {
            log.error("Error printing css chunk", e);
        }
    }
    

    private String getTag(String format, String extension, String chunkName, SlingHttpServletRequest request){
        
        StringBuilder stringBuilder = new StringBuilder();
        final Map<String, String> manifestAsMap;
        try {
            manifestAsMap = assetManifestService.getManifest(request);
    
            final String qualifiedChunk = chunkName + extension;
            if(manifestAsMap.containsKey(qualifiedChunk)){
                stringBuilder.append(String.format(format, manifestAsMap.get(qualifiedChunk)));
            }
    
            if(manifestAsMap.containsKey("vendors~" + qualifiedChunk)){
                stringBuilder.append(String.format(format, manifestAsMap.get("vendors~" + qualifiedChunk)));
            }
    
            if(manifestAsMap.containsKey("default~" + qualifiedChunk)){
                stringBuilder.append(String.format(format, manifestAsMap.get("default~" + qualifiedChunk)));
            }
            
        } catch (IOException | LoginException e) {
            log.error("Error computing  chunk", e);
        }
        
        return stringBuilder.toString();
    
       
    }
}