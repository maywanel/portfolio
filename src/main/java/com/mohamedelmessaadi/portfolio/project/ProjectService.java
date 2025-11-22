package com.mohamedelmessaadi.portfolio.project;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohamedelmessaadi.portfolio.config.PortfolioProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final ResourceLoader resourceLoader;
    private final PortfolioProperties properties;
    private final AtomicReference<List<Project>> fallbackProjects = new AtomicReference<>(List.of());
    private final AtomicReference<List<Project>> cachedProjects = new AtomicReference<>(List.of());
    private Instant lastRefresh = Instant.EPOCH;

    public ProjectService(ObjectMapper objectMapper,
                          ResourceLoader resourceLoader,
                          PortfolioProperties properties) {
        this.objectMapper = objectMapper;
        this.resourceLoader = resourceLoader;
        this.properties = properties;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.github.com")
            .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader("User-Agent", "portfolio-backend")
                .build();
        loadFallbackProjects();
    }

    public synchronized List<Project> getProjects() {
        var ttl = Duration.ofMinutes(Math.max(1, properties.getGithub().getCacheTtlMinutes()));
        var now = Instant.now();
        var cached = cachedProjects.get();
        if (!cached.isEmpty() && Duration.between(lastRefresh, now).compareTo(ttl) < 0) {
            return cached;
        }

        try {
            var projects = fetchFromGithub();
            if (!projects.isEmpty()) {
                cachedProjects.set(projects);
                lastRefresh = now;
                return projects;
            }
        } catch (Exception ex) {
            logger.warn("Falling back to static projects after GitHub fetch failure", ex);
        }

        var fallback = fallbackProjects.get();
        cachedProjects.set(fallback);
        lastRefresh = now;
        return fallback;
    }

    private void loadFallbackProjects() {
        try {
            Resource resource = resourceLoader.getResource(properties.getGithub().getFallbackFile());
            try (InputStream inputStream = resource.getInputStream()) {
                List<Project> projects = objectMapper.readValue(inputStream, new TypeReference<>() {});
                fallbackProjects.set(projects);
                cachedProjects.set(projects);
            }
        } catch (IOException ex) {
            logger.error("Unable to load fallback project data", ex);
            fallbackProjects.set(Collections.emptyList());
        }
    }

    private List<Project> fetchFromGithub() {
        var username = properties.getGithub().getUsername();
        GithubRepository[] repositories = restClient.get()
                .uri("/users/{username}/repos?per_page=100&sort=updated", username)
                .retrieve()
                .body(GithubRepository[].class);

        if (repositories == null || repositories.length == 0) {
            return List.of();
        }

        return Arrays.stream(repositories)
                .filter(repo -> !repo.fork())
                .sorted(Comparator
                        .comparingInt(GithubRepository::stargazersCount)
                        .reversed()
                        .thenComparing((GithubRepository repo) -> Objects.requireNonNullElse(repo.pushedAt(), Instant.EPOCH), Comparator.reverseOrder()))
                .limit(6)
                .map(ProjectService::mapRepository)
                .toList();
    }

    private static Project mapRepository(GithubRepository repository) {
        return new Project(
                repository.name(),
                repository.description(),
                repository.htmlUrl(),
                repository.language(),
                repository.stargazersCount(),
                repository.pushedAt()
        );
    }

        private record GithubRepository(
            String name,
            String description,
            @JsonProperty("html_url") String htmlUrl,
            String language,
            @JsonProperty("stargazers_count") int stargazersCount,
            @JsonProperty("pushed_at") Instant pushedAt,
            boolean fork
        ) { }
}
