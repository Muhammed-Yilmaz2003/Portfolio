(function() {
            'use strict';

            const GITHUB_USERNAME = 'your-username'; 

            const GITHUB_API_URL =
                `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`;


            const projectsContainer = document.getElementById('projectsContainer');
            const repoCountEl = document.getElementById('repoCount');
            const navToggle = document.getElementById('navToggle');
            const navLinks = document.getElementById('navLinks');



            navToggle.addEventListener('click', function() {
                navLinks.classList.toggle('open');
                const icon = navToggle.querySelector('i');
                if (navLinks.classList.contains('open')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });

            navLinks.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('open');
                    const icon = navToggle.querySelector('i');
                    icon.className = 'fas fa-bars';
                });
            });



            async function fetchGitHubProjects() {
                try {
                    const response = await fetch(GITHUB_API_URL);

                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error(
                                `User "${GITHUB_USERNAME}" not found. Please update the GITHUB_USERNAME variable.`
                                );
                        }
                        throw new Error(`GitHub API error: ${response.status}`);
                    }

                    const repos = await response.json();

                    if (repoCountEl) {
                        repoCountEl.textContent = repos.length;
                    }

                    renderProjects(repos);

                } catch (error) {
                    console.error('Failed to fetch projects:', error);
                    projectsContainer.innerHTML = `
                                <div class="error-projects">
                                    <i class="fas fa-circle-exclamation"></i>
                                    <p>${error.message}</p>
                                    <p style="font-size:0.9rem; margin-top:0.4rem;">
                                        Make sure you've set the correct GitHub username in the script.
                                    </p>
                                </div>
                            `;
                }
            }


            function renderProjects(repos) {
                if (!repos || repos.length === 0) {
                    projectsContainer.innerHTML = `
                                <div class="error-projects">
                                    <i class="fas fa-inbox"></i>
                                    <p>No public repositories found for this user.</p>
                                </div>
                            `;
                    return;
                }

                let html = '<div class="projects-grid">';

                repos.forEach(function(repo) {
                    const name = repo.name || 'Unnamed';
                    const description = repo.description || 'No description provided.';
                    const stars = repo.stargazers_count || 0;
                    const forks = repo.forks_count || 0;
                    const language = repo.language || '—';
                    const url = repo.html_url || '#';

                    // Truncate description if too long
                    const descShort = description.length > 120 ?
                        description.slice(0, 120) + '…' :
                        description;

                    html += `
                                <div class="project-card">
                                    <div class="repo-name">
                                        <i class="fab fa-github"></i> ${escapeHtml(name)}
                                    </div>
                                    <div class="repo-desc">${escapeHtml(descShort)}</div>
                                    <div class="repo-meta">
                                        <span><i class="fas fa-code"></i> ${escapeHtml(language)}</span>
                                        <span><i class="fas fa-star"></i> ${stars}</span>
                                        <span><i class="fas fa-code-fork"></i> ${forks}</span>
                                    </div>
                                    <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="repo-link">
                                        View repo <i class="fas fa-arrow-right"></i>
                                    </a>
                                </div>
                            `;
                });

                html += '</div>';
                projectsContainer.innerHTML = html;
            }


            function escapeHtml(text) {
                if (!text) return '';
                const map = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                };
                return String(text).replace(/[&<>"']/g, function(m) {
                    return map[m];
                });
            }


            fetchGitHubProjects();

        })();