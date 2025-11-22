package com.mohamedelmessaadi.portfolio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "portfolio")
public class PortfolioProperties {

    private final Github github = new Github();

    public Github getGithub() {
        return github;
    }

    public static class Github {
 
        private String username = "maywanel";
        private String fallbackFile = "classpath:projects-fallback.json";
        private long cacheTtlMinutes = 30;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getFallbackFile() {
            return fallbackFile;
        }

        public void setFallbackFile(String fallbackFile) {
            this.fallbackFile = fallbackFile;
        }

        public long getCacheTtlMinutes() {
            return cacheTtlMinutes;
        }

        public void setCacheTtlMinutes(long cacheTtlMinutes) {
            this.cacheTtlMinutes = cacheTtlMinutes;
        }
    }
}
