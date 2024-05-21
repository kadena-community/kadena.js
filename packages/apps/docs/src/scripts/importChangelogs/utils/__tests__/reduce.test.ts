import {
  getAuthor,
  reduceCommitData,
  reduceCommitDataCommit,
  reduceHeaderData,
  reducePRData,
  reduceUserData,
} from '../reduce';

describe('reduce utils', () => {
  describe('reducePRData', () => {
    it('should only return the properties that we need of the pr data', () => {
      const data: IGitHubPRData = {
        status: 200,
        url: 'https://api.github.com/repos/kadena-io/pact/pulls/1326',
        headers: {
          'access-control-allow-origin': '*',
          'access-control-expose-headers':
            'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset',
          'cache-control': 'private, max-age=60, s-maxage=60',
          'content-encoding': 'gzip',
          'content-security-policy': "default-src 'none'",
          'content-type': 'application/json; charset=utf-8',
          date: 'Fri, 17 May 2024 09:10:22 GMT',
          etag: 'W/"ab312e6d227bf0427f15e1d6bde7b6670caa1de1d8953080ebadee5d6146e897"',
          'github-authentication-token-expiration': '2024-05-21 10:10:40 UTC',
          'last-modified': 'Fri, 10 May 2024 16:24:21 GMT',
          'referrer-policy':
            'origin-when-cross-origin, strict-origin-when-cross-origin',
          server: 'GitHub.com',
          'strict-transport-security':
            'max-age=31536000; includeSubdomains; preload',
          'transfer-encoding': 'chunked',
          vary: 'Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With',
          'x-accepted-oauth-scopes': '',
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'deny',
          'x-github-api-version-selected': '2022-11-28',
          'x-github-media-type': 'github.v3; format=json',
          'x-github-request-id': 'DFFE:27A1C2:11AC4A3A:11C34C1E:66471EFE',
          'x-oauth-scopes':
            'public_repo, repo:invite, repo:status, repo_deployment',
          'x-ratelimit-limit': '5000',
          'x-ratelimit-remaining': '4970',
          'x-ratelimit-reset': '1715938348',
          'x-ratelimit-resource': 'core',
          'x-ratelimit-used': '30',
          'x-xss-protection': '0',
        },
        data: {
          url: 'https://api.github.com/repos/kadena-io/pact/pulls/1326',
          id: 1639305490,
          node_id: 'PR_kwDOBGMAX85htdES',
          html_url: 'https://github.com/kadena-io/pact/pull/1326',
          diff_url: 'https://github.com/kadena-io/pact/pull/1326.diff',
          patch_url: 'https://github.com/kadena-io/pact/pull/1326.patch',
          issue_url: 'https://api.github.com/repos/kadena-io/pact/issues/1326',
          number: 1326,
          state: 'closed',
          locked: false,
          title: 'List-modules moved to local-only',
          user: {
            login: 'jmcardon',
            id: 15273652,
            node_id: 'MDQ6VXNlcjE1MjczNjUy',
            avatar_url: 'https://avatars.githubusercontent.com/u/15273652?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/jmcardon',
            html_url: 'https://github.com/jmcardon',
            followers_url: 'https://api.github.com/users/jmcardon/followers',
            following_url:
              'https://api.github.com/users/jmcardon/following{/other_user}',
            gists_url: 'https://api.github.com/users/jmcardon/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/jmcardon/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/jmcardon/subscriptions',
            organizations_url: 'https://api.github.com/users/jmcardon/orgs',
            repos_url: 'https://api.github.com/users/jmcardon/repos',
            events_url:
              'https://api.github.com/users/jmcardon/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/jmcardon/received_events',
            type: 'User',
            site_admin: false,
          },
          body: 'PR checklist:\r\n\r\n* [ ] Test coverage for the proposed changes\r\n* [ ] PR description contains example output from repl interaction or a snippet from unit test output\r\n* [ ] Documentation has been updated if new natives or FV properties have been added. To generate new documentation, issue `cabal run tests`. If they pass locally, docs are generated.\r\n* [ ] Any changes that could be relevant to users [have been recorded in the changelog](https://github.com/kadena-io/pact/blob/master/CHANGELOG.md)\r\n* [ ] In case of  changes to the Pact trace output (`pact -t`), make sure [pact-lsp](https://github.com/kadena-io/pact-lsp) is in sync.\r\n\r\nAdditionally, please justify why you should or should not do the following:\r\n\r\n* [ ] Confirm replay/back compat\r\n* [ ] Benchmark regressions\r\n* [ ] (For Kadena engineers) Run integration-tests against a Chainweb built with this version of Pact\r\n',
          created_at: '2023-12-11T17:42:26Z',
          updated_at: '2024-05-10T16:24:21Z',
          closed_at: '2024-02-16T16:12:00Z',
          merged_at: '2024-02-16T16:12:00Z',
          merge_commit_sha: '1779158ee582a84623b2ab85576d214f8069d70f',
          assignee: null,
          assignees: [],
          requested_reviewers: [
            {
              login: 'sirlensalot',
              id: 8353613,
              node_id: 'MDQ6VXNlcjgzNTM2MTM=',
              avatar_url: 'https://avatars.githubusercontent.com/u/8353613?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/sirlensalot',
              html_url: 'https://github.com/sirlensalot',
              followers_url:
                'https://api.github.com/users/sirlensalot/followers',
              following_url:
                'https://api.github.com/users/sirlensalot/following{/other_user}',
              gists_url:
                'https://api.github.com/users/sirlensalot/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/sirlensalot/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/sirlensalot/subscriptions',
              organizations_url:
                'https://api.github.com/users/sirlensalot/orgs',
              repos_url: 'https://api.github.com/users/sirlensalot/repos',
              events_url:
                'https://api.github.com/users/sirlensalot/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/sirlensalot/received_events',
              type: 'User',
              site_admin: false,
            },
          ],
          requested_teams: [],
          labels: [],
          milestone: null,
          draft: false,
          commits_url:
            'https://api.github.com/repos/kadena-io/pact/pulls/1326/commits',
          review_comments_url:
            'https://api.github.com/repos/kadena-io/pact/pulls/1326/comments',
          review_comment_url:
            'https://api.github.com/repos/kadena-io/pact/pulls/comments{/number}',
          comments_url:
            'https://api.github.com/repos/kadena-io/pact/issues/1326/comments',
          statuses_url:
            'https://api.github.com/repos/kadena-io/pact/statuses/f712b6155b160ddc6e77753f69c839a3fb5440cf',
          head: {
            label: 'kadena-io:jose/list-modules-local',
            ref: 'jose/list-modules-local',
            sha: 'f712b6155b160ddc6e77753f69c839a3fb5440cf',
            user: {
              login: 'kadena-io',
              id: 19830776,
              node_id: 'MDEyOk9yZ2FuaXphdGlvbjE5ODMwNzc2',
              avatar_url:
                'https://avatars.githubusercontent.com/u/19830776?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/kadena-io',
              html_url: 'https://github.com/kadena-io',
              followers_url: 'https://api.github.com/users/kadena-io/followers',
              following_url:
                'https://api.github.com/users/kadena-io/following{/other_user}',
              gists_url:
                'https://api.github.com/users/kadena-io/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/kadena-io/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/kadena-io/subscriptions',
              organizations_url: 'https://api.github.com/users/kadena-io/orgs',
              repos_url: 'https://api.github.com/users/kadena-io/repos',
              events_url:
                'https://api.github.com/users/kadena-io/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/kadena-io/received_events',
              type: 'Organization',
              site_admin: false,
            },
            repo: {
              id: 73597023,
              node_id: 'MDEwOlJlcG9zaXRvcnk3MzU5NzAyMw==',
              name: 'pact',
              full_name: 'kadena-io/pact',
              private: false,
              owner: {
                login: 'kadena-io',
                id: 19830776,
                node_id: 'MDEyOk9yZ2FuaXphdGlvbjE5ODMwNzc2',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/19830776?v=4',
                gravatar_id: '',
                url: 'https://api.github.com/users/kadena-io',
                html_url: 'https://github.com/kadena-io',
                followers_url:
                  'https://api.github.com/users/kadena-io/followers',
                following_url:
                  'https://api.github.com/users/kadena-io/following{/other_user}',
                gists_url:
                  'https://api.github.com/users/kadena-io/gists{/gist_id}',
                starred_url:
                  'https://api.github.com/users/kadena-io/starred{/owner}{/repo}',
                subscriptions_url:
                  'https://api.github.com/users/kadena-io/subscriptions',
                organizations_url:
                  'https://api.github.com/users/kadena-io/orgs',
                repos_url: 'https://api.github.com/users/kadena-io/repos',
                events_url:
                  'https://api.github.com/users/kadena-io/events{/privacy}',
                received_events_url:
                  'https://api.github.com/users/kadena-io/received_events',
                type: 'Organization',
                site_admin: false,
              },
              html_url: 'https://github.com/kadena-io/pact',
              description: 'The Pact Smart Contract Language',
              fork: false,
              url: 'https://api.github.com/repos/kadena-io/pact',
              forks_url: 'https://api.github.com/repos/kadena-io/pact/forks',
              keys_url:
                'https://api.github.com/repos/kadena-io/pact/keys{/key_id}',
              collaborators_url:
                'https://api.github.com/repos/kadena-io/pact/collaborators{/collaborator}',
              teams_url: 'https://api.github.com/repos/kadena-io/pact/teams',
              hooks_url: 'https://api.github.com/repos/kadena-io/pact/hooks',
              issue_events_url:
                'https://api.github.com/repos/kadena-io/pact/issues/events{/number}',
              events_url: 'https://api.github.com/repos/kadena-io/pact/events',
              assignees_url:
                'https://api.github.com/repos/kadena-io/pact/assignees{/user}',
              branches_url:
                'https://api.github.com/repos/kadena-io/pact/branches{/branch}',
              tags_url: 'https://api.github.com/repos/kadena-io/pact/tags',
              blobs_url:
                'https://api.github.com/repos/kadena-io/pact/git/blobs{/sha}',
              git_tags_url:
                'https://api.github.com/repos/kadena-io/pact/git/tags{/sha}',
              git_refs_url:
                'https://api.github.com/repos/kadena-io/pact/git/refs{/sha}',
              trees_url:
                'https://api.github.com/repos/kadena-io/pact/git/trees{/sha}',
              statuses_url:
                'https://api.github.com/repos/kadena-io/pact/statuses/{sha}',
              languages_url:
                'https://api.github.com/repos/kadena-io/pact/languages',
              stargazers_url:
                'https://api.github.com/repos/kadena-io/pact/stargazers',
              contributors_url:
                'https://api.github.com/repos/kadena-io/pact/contributors',
              subscribers_url:
                'https://api.github.com/repos/kadena-io/pact/subscribers',
              subscription_url:
                'https://api.github.com/repos/kadena-io/pact/subscription',
              commits_url:
                'https://api.github.com/repos/kadena-io/pact/commits{/sha}',
              git_commits_url:
                'https://api.github.com/repos/kadena-io/pact/git/commits{/sha}',
              comments_url:
                'https://api.github.com/repos/kadena-io/pact/comments{/number}',
              issue_comment_url:
                'https://api.github.com/repos/kadena-io/pact/issues/comments{/number}',
              contents_url:
                'https://api.github.com/repos/kadena-io/pact/contents/{+path}',
              compare_url:
                'https://api.github.com/repos/kadena-io/pact/compare/{base}...{head}',
              merges_url: 'https://api.github.com/repos/kadena-io/pact/merges',
              archive_url:
                'https://api.github.com/repos/kadena-io/pact/{archive_format}{/ref}',
              downloads_url:
                'https://api.github.com/repos/kadena-io/pact/downloads',
              issues_url:
                'https://api.github.com/repos/kadena-io/pact/issues{/number}',
              pulls_url:
                'https://api.github.com/repos/kadena-io/pact/pulls{/number}',
              milestones_url:
                'https://api.github.com/repos/kadena-io/pact/milestones{/number}',
              notifications_url:
                'https://api.github.com/repos/kadena-io/pact/notifications{?since,all,participating}',
              labels_url:
                'https://api.github.com/repos/kadena-io/pact/labels{/name}',
              releases_url:
                'https://api.github.com/repos/kadena-io/pact/releases{/id}',
              deployments_url:
                'https://api.github.com/repos/kadena-io/pact/deployments',
              created_at: '2016-11-13T05:16:00Z',
              updated_at: '2024-05-15T16:05:39Z',
              pushed_at: '2024-05-15T16:05:33Z',
              git_url: 'git://github.com/kadena-io/pact.git',
              ssh_url: 'git@github.com:kadena-io/pact.git',
              clone_url: 'https://github.com/kadena-io/pact.git',
              svn_url: 'https://github.com/kadena-io/pact',
              homepage: 'https://pact-language.readthedocs.io/en/stable/',
              size: 15299,
              stargazers_count: 577,
              watchers_count: 577,
              language: 'Haskell',
              has_issues: true,
              has_projects: true,
              has_downloads: true,
              has_wiki: true,
              has_pages: false,
              has_discussions: false,
              forks_count: 102,
              mirror_url: null,
              archived: false,
              disabled: false,
              open_issues_count: 135,
              license: {
                key: 'bsd-3-clause',
                name: 'BSD 3-Clause "New" or "Revised" License',
                spdx_id: 'BSD-3-Clause',
                url: 'https://api.github.com/licenses/bsd-3-clause',
                node_id: 'MDc6TGljZW5zZTU=',
              },
              allow_forking: true,
              is_template: false,
              web_commit_signoff_required: false,
              topics: ['blockchain', 'pact', 'smart-contracts'],
              visibility: 'public',
              forks: 102,
              open_issues: 135,
              watchers: 577,
              default_branch: 'master',
            },
          },
          base: {
            label: 'kadena-io:master',
            ref: 'master',
            sha: 'fb80a66eeeb473c2e47538e514570c834e98335f',
            user: {
              login: 'kadena-io',
              id: 19830776,
              node_id: 'MDEyOk9yZ2FuaXphdGlvbjE5ODMwNzc2',
              avatar_url:
                'https://avatars.githubusercontent.com/u/19830776?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/kadena-io',
              html_url: 'https://github.com/kadena-io',
              followers_url: 'https://api.github.com/users/kadena-io/followers',
              following_url:
                'https://api.github.com/users/kadena-io/following{/other_user}',
              gists_url:
                'https://api.github.com/users/kadena-io/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/kadena-io/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/kadena-io/subscriptions',
              organizations_url: 'https://api.github.com/users/kadena-io/orgs',
              repos_url: 'https://api.github.com/users/kadena-io/repos',
              events_url:
                'https://api.github.com/users/kadena-io/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/kadena-io/received_events',
              type: 'Organization',
              site_admin: false,
            },
            repo: {
              id: 73597023,
              node_id: 'MDEwOlJlcG9zaXRvcnk3MzU5NzAyMw==',
              name: 'pact',
              full_name: 'kadena-io/pact',
              private: false,
              owner: {
                login: 'kadena-io',
                id: 19830776,
                node_id: 'MDEyOk9yZ2FuaXphdGlvbjE5ODMwNzc2',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/19830776?v=4',
                gravatar_id: '',
                url: 'https://api.github.com/users/kadena-io',
                html_url: 'https://github.com/kadena-io',
                followers_url:
                  'https://api.github.com/users/kadena-io/followers',
                following_url:
                  'https://api.github.com/users/kadena-io/following{/other_user}',
                gists_url:
                  'https://api.github.com/users/kadena-io/gists{/gist_id}',
                starred_url:
                  'https://api.github.com/users/kadena-io/starred{/owner}{/repo}',
                subscriptions_url:
                  'https://api.github.com/users/kadena-io/subscriptions',
                organizations_url:
                  'https://api.github.com/users/kadena-io/orgs',
                repos_url: 'https://api.github.com/users/kadena-io/repos',
                events_url:
                  'https://api.github.com/users/kadena-io/events{/privacy}',
                received_events_url:
                  'https://api.github.com/users/kadena-io/received_events',
                type: 'Organization',
                site_admin: false,
              },
              html_url: 'https://github.com/kadena-io/pact',
              description: 'The Pact Smart Contract Language',
              fork: false,
              url: 'https://api.github.com/repos/kadena-io/pact',
              forks_url: 'https://api.github.com/repos/kadena-io/pact/forks',
              keys_url:
                'https://api.github.com/repos/kadena-io/pact/keys{/key_id}',
              collaborators_url:
                'https://api.github.com/repos/kadena-io/pact/collaborators{/collaborator}',
              teams_url: 'https://api.github.com/repos/kadena-io/pact/teams',
              hooks_url: 'https://api.github.com/repos/kadena-io/pact/hooks',
              issue_events_url:
                'https://api.github.com/repos/kadena-io/pact/issues/events{/number}',
              events_url: 'https://api.github.com/repos/kadena-io/pact/events',
              assignees_url:
                'https://api.github.com/repos/kadena-io/pact/assignees{/user}',
              branches_url:
                'https://api.github.com/repos/kadena-io/pact/branches{/branch}',
              tags_url: 'https://api.github.com/repos/kadena-io/pact/tags',
              blobs_url:
                'https://api.github.com/repos/kadena-io/pact/git/blobs{/sha}',
              git_tags_url:
                'https://api.github.com/repos/kadena-io/pact/git/tags{/sha}',
              git_refs_url:
                'https://api.github.com/repos/kadena-io/pact/git/refs{/sha}',
              trees_url:
                'https://api.github.com/repos/kadena-io/pact/git/trees{/sha}',
              statuses_url:
                'https://api.github.com/repos/kadena-io/pact/statuses/{sha}',
              languages_url:
                'https://api.github.com/repos/kadena-io/pact/languages',
              stargazers_url:
                'https://api.github.com/repos/kadena-io/pact/stargazers',
              contributors_url:
                'https://api.github.com/repos/kadena-io/pact/contributors',
              subscribers_url:
                'https://api.github.com/repos/kadena-io/pact/subscribers',
              subscription_url:
                'https://api.github.com/repos/kadena-io/pact/subscription',
              commits_url:
                'https://api.github.com/repos/kadena-io/pact/commits{/sha}',
              git_commits_url:
                'https://api.github.com/repos/kadena-io/pact/git/commits{/sha}',
              comments_url:
                'https://api.github.com/repos/kadena-io/pact/comments{/number}',
              issue_comment_url:
                'https://api.github.com/repos/kadena-io/pact/issues/comments{/number}',
              contents_url:
                'https://api.github.com/repos/kadena-io/pact/contents/{+path}',
              compare_url:
                'https://api.github.com/repos/kadena-io/pact/compare/{base}...{head}',
              merges_url: 'https://api.github.com/repos/kadena-io/pact/merges',
              archive_url:
                'https://api.github.com/repos/kadena-io/pact/{archive_format}{/ref}',
              downloads_url:
                'https://api.github.com/repos/kadena-io/pact/downloads',
              issues_url:
                'https://api.github.com/repos/kadena-io/pact/issues{/number}',
              pulls_url:
                'https://api.github.com/repos/kadena-io/pact/pulls{/number}',
              milestones_url:
                'https://api.github.com/repos/kadena-io/pact/milestones{/number}',
              notifications_url:
                'https://api.github.com/repos/kadena-io/pact/notifications{?since,all,participating}',
              labels_url:
                'https://api.github.com/repos/kadena-io/pact/labels{/name}',
              releases_url:
                'https://api.github.com/repos/kadena-io/pact/releases{/id}',
              deployments_url:
                'https://api.github.com/repos/kadena-io/pact/deployments',
              created_at: '2016-11-13T05:16:00Z',
              updated_at: '2024-05-15T16:05:39Z',
              pushed_at: '2024-05-15T16:05:33Z',
              git_url: 'git://github.com/kadena-io/pact.git',
              ssh_url: 'git@github.com:kadena-io/pact.git',
              clone_url: 'https://github.com/kadena-io/pact.git',
              svn_url: 'https://github.com/kadena-io/pact',
              homepage: 'https://pact-language.readthedocs.io/en/stable/',
              size: 15299,
              stargazers_count: 577,
              watchers_count: 577,
              language: 'Haskell',
              has_issues: true,
              has_projects: true,
              has_downloads: true,
              has_wiki: true,
              has_pages: false,
              has_discussions: false,
              forks_count: 102,
              mirror_url: null,
              archived: false,
              disabled: false,
              open_issues_count: 135,
              license: {
                key: 'bsd-3-clause',
                name: 'BSD 3-Clause "New" or "Revised" License',
                spdx_id: 'BSD-3-Clause',
                url: 'https://api.github.com/licenses/bsd-3-clause',
                node_id: 'MDc6TGljZW5zZTU=',
              },
              allow_forking: true,
              is_template: false,
              web_commit_signoff_required: false,
              topics: ['blockchain', 'pact', 'smart-contracts'],
              visibility: 'public',
              forks: 102,
              open_issues: 135,
              watchers: 577,
              default_branch: 'master',
            },
          },
          _links: {
            self: {
              href: 'https://api.github.com/repos/kadena-io/pact/pulls/1326',
            },
            html: {
              href: 'https://github.com/kadena-io/pact/pull/1326',
            },
            issue: {
              href: 'https://api.github.com/repos/kadena-io/pact/issues/1326',
            },
            comments: {
              href: 'https://api.github.com/repos/kadena-io/pact/issues/1326/comments',
            },
            review_comments: {
              href: 'https://api.github.com/repos/kadena-io/pact/pulls/1326/comments',
            },
            review_comment: {
              href: 'https://api.github.com/repos/kadena-io/pact/pulls/comments{/number}',
            },
            commits: {
              href: 'https://api.github.com/repos/kadena-io/pact/pulls/1326/commits',
            },
            statuses: {
              href: 'https://api.github.com/repos/kadena-io/pact/statuses/f712b6155b160ddc6e77753f69c839a3fb5440cf',
            },
          },
          author_association: 'MEMBER',
          auto_merge: null,
          active_lock_reason: null,
          merged: true,
          mergeable: null,
          rebaseable: null,
          mergeable_state: 'unknown',
          merged_by: {
            login: 'jmcardon',
            id: 15273652,
            node_id: 'MDQ6VXNlcjE1MjczNjUy',
            avatar_url: 'https://avatars.githubusercontent.com/u/15273652?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/jmcardon',
            html_url: 'https://github.com/jmcardon',
            followers_url: 'https://api.github.com/users/jmcardon/followers',
            following_url:
              'https://api.github.com/users/jmcardon/following{/other_user}',
            gists_url: 'https://api.github.com/users/jmcardon/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/jmcardon/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/jmcardon/subscriptions',
            organizations_url: 'https://api.github.com/users/jmcardon/orgs',
            repos_url: 'https://api.github.com/users/jmcardon/repos',
            events_url:
              'https://api.github.com/users/jmcardon/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/jmcardon/received_events',
            type: 'User',
            site_admin: false,
          },
          comments: 2,
          review_comments: 1,
          maintainer_can_modify: false,
          commits: 8,
          additions: 99,
          deletions: 31,
          changed_files: 7,
        },
      };

      const result = reducePRData(data);

      console.log(result);
      const expetedResult = {
        url: 'https://api.github.com/repos/kadena-io/pact/pulls/1326',
        headers: {
          'last-modified': 'Fri, 10 May 2024 16:24:21 GMT',
          date: 'Fri, 17 May 2024 09:10:22 GMT',
        },
        data: {
          title: 'List-modules moved to local-only',
          html_url: 'https://github.com/kadena-io/pact/pull/1326',
          user: {
            login: 'jmcardon',
            id: 15273652,
            avatar_url: 'https://avatars.githubusercontent.com/u/15273652?v=4',
            html_url: 'https://github.com/jmcardon',
            url: 'https://api.github.com/users/jmcardon',
          },
          body:
            'PR checklist:\r\n' +
            '\r\n' +
            '* [ ] Test coverage for the proposed changes\r\n' +
            '* [ ] PR description contains example output from repl interaction or a snippet from unit test output\r\n' +
            '* [ ] Documentation has been updated if new natives or FV properties have been added. To generate new documentation, issue `cabal run tests`. If they pass locally, docs are generated.\r\n' +
            '* [ ] Any changes that could be relevant to users [have been recorded in the changelog](https://github.com/kadena-io/pact/blob/master/CHANGELOG.md)\r\n' +
            '* [ ] In case of  changes to the Pact trace output (`pact -t`), make sure [pact-lsp](https://github.com/kadena-io/pact-lsp) is in sync.\r\n' +
            '\r\n' +
            'Additionally, please justify why you should or should not do the following:\r\n' +
            '\r\n' +
            '* [ ] Confirm replay/back compat\r\n' +
            '* [ ] Benchmark regressions\r\n' +
            '* [ ] (For Kadena engineers) Run integration-tests against a Chainweb built with this version of Pact\r\n',
        },
      };

      expect(result).toEqual(expetedResult);
    });
  });
  describe('reduceCommitData', () => {
    it('should only return the properties that we need of the commit data', () => {
      const data: IGitHubCommitData = {
        status: 200,
        url: 'https://api.github.com/repos/kadena-community/kadena.js/commits/b06929dcc',
        headers: {
          'access-control-allow-origin': '*',
          'access-control-expose-headers':
            'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset',
          'cache-control': 'private, max-age=60, s-maxage=60',
          'content-encoding': 'gzip',
          'content-security-policy': "default-src 'none'",
          'content-type': 'application/json; charset=utf-8',
          date: 'Fri, 17 May 2024 09:07:27 GMT',
          etag: 'W/"3d9854d055051378fc4a9d0862ac4ef0584d6132d2c0cd19a887b7729452ec17"',
          'github-authentication-token-expiration': '2024-05-21 10:10:40 UTC',
          'last-modified': 'Wed, 08 May 2024 14:47:15 GMT',
          'referrer-policy':
            'origin-when-cross-origin, strict-origin-when-cross-origin',
          server: 'GitHub.com',
          'strict-transport-security':
            'max-age=31536000; includeSubdomains; preload',
          'transfer-encoding': 'chunked',
          vary: 'Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With',
          'x-accepted-oauth-scopes': '',
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'deny',
          'x-github-api-version-selected': '2022-11-28',
          'x-github-media-type': 'github.v3; format=json',
          'x-github-request-id': 'DFF0:0EBB:4442624:44B8A94:66471E4F',
          'x-oauth-scopes':
            'public_repo, repo:invite, repo:status, repo_deployment',
          'x-ratelimit-limit': '5000',
          'x-ratelimit-remaining': '4976',
          'x-ratelimit-reset': '1715938348',
          'x-ratelimit-resource': 'core',
          'x-ratelimit-used': '24',
          'x-xss-protection': '0',
        },
        data: {
          sha: 'b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
          node_id:
            'C_kwDOHRRhtdoAKGIwNjkyOWRjYzIxMzZlZWNmMWY4N2I3N2UxNzEyYTNlOTFlZDQ3ZjQ',
          commit: {
            author: {
              name: 'ferreroltd',
              email: '73488793+ferreroltd@users.noreply.github.com',
              date: '2024-05-08T14:47:15Z',
            },
            committer: {
              name: 'GitHub',
              email: 'noreply@github.com',
              date: '2024-05-08T14:47:15Z',
            },
            message: 'Feat/dialog sizes (#2076)',
            tree: {
              sha: '248fe09792d041c426efe83f5e4485403789ed63',
              url: 'https://api.github.com/repos/kadena-community/kadena.js/git/trees/248fe09792d041c426efe83f5e4485403789ed63',
            },
            url: 'https://api.github.com/repos/kadena-community/kadena.js/git/commits/b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
            comment_count: 0,
            verification: {
              verified: true,
              reason: 'valid',
              signature:
                '-----BEGIN PGP SIGNATURE-----\n\nwsFcBAABCAAQBQJmO5BzCRC1aQ7uu5UhlAAANYAQAGrXSbiLvlbet2lVo10owxwy\nA/5J4ehM2YezdSByIGDfXvczeY340jlqrdv2604FoNp5lOelRYcljUHahM2O7vHo\naNaF9/eiB1+hck5JOczlTbesVJGdQGwE1kYsDs1Ntn9487Ef/XKjTsp2Pc+vTVTu\nIbk2plDpoijalW/X+It4Kug7uQyZdLz0OJgCsJlthgnBPKPd7UTKpubYKPMEN5i6\nwwkBVvP9fT1ByFXF6uACboVdc0miK5CEkK21zDRPrQKwCPU3TcG5pxAdSAQZC/Ws\ngCvAIyu4WEBPR2VhQr55UszMaIbR76Q7mR2iTMrZJxanfRcfj385Ggyx3T1GF+tK\nJtjli4XaCwnTaxru0mozTwFcP5M6xFnQcElcUxLSisZCbX/VpDH9rSIOJ4yrmTKs\nTOEX2xkjiVOUr+N2rIFi1q2m9RSGyV7rSJiPe+DH2PTNh9srsrEuh/ZF7vUW5vNQ\nwYf3Yx8tQlzlZq+y3grQg3edR0MgTO20qYnDmcciHbxdUcPLmTWeMnZCwuzehtr2\nG1NuJyGF/2okZVvWuzvfLL7g369X/ekSpzt2kYjb15n0+bqsrOYyYbpLjIk8Tobq\nDcPTT+lCJF3/XdDQlDy+uZYInY/vQcrlOHVbMVzAx7Vi+SL0U3hlP2mOzrOBExF9\nYxgwdwZRsqzvJGz/Ccze\n=qdCR\n-----END PGP SIGNATURE-----\n',
              payload:
                'tree 248fe09792d041c426efe83f5e4485403789ed63\nparent 0ae818d52f9cc2ccbcb3ca03bfbc21d9d35758a9\nauthor ferreroltd <73488793+ferreroltd@users.noreply.github.com> 1715179635 +0100\ncommitter GitHub <noreply@github.com> 1715179635 +0200\n\nFeat/dialog sizes (#2076)\n\n',
            },
          },
          url: 'https://api.github.com/repos/kadena-community/kadena.js/commits/b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
          html_url:
            'https://github.com/kadena-community/kadena.js/commit/b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
          comments_url:
            'https://api.github.com/repos/kadena-community/kadena.js/commits/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/comments',
          author: {
            login: 'ferreroltd',
            id: 73488793,
            node_id: 'MDQ6VXNlcjczNDg4Nzkz',
            avatar_url: 'https://avatars.githubusercontent.com/u/73488793?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/ferreroltd',
            html_url: 'https://github.com/ferreroltd',
            followers_url: 'https://api.github.com/users/ferreroltd/followers',
            following_url:
              'https://api.github.com/users/ferreroltd/following{/other_user}',
            gists_url:
              'https://api.github.com/users/ferreroltd/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/ferreroltd/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/ferreroltd/subscriptions',
            organizations_url: 'https://api.github.com/users/ferreroltd/orgs',
            repos_url: 'https://api.github.com/users/ferreroltd/repos',
            events_url:
              'https://api.github.com/users/ferreroltd/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/ferreroltd/received_events',
            type: 'User',
            site_admin: false,
          },
          committer: {
            login: 'web-flow',
            id: 19864447,
            node_id: 'MDQ6VXNlcjE5ODY0NDQ3',
            avatar_url: 'https://avatars.githubusercontent.com/u/19864447?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/web-flow',
            html_url: 'https://github.com/web-flow',
            followers_url: 'https://api.github.com/users/web-flow/followers',
            following_url:
              'https://api.github.com/users/web-flow/following{/other_user}',
            gists_url: 'https://api.github.com/users/web-flow/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/web-flow/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/web-flow/subscriptions',
            organizations_url: 'https://api.github.com/users/web-flow/orgs',
            repos_url: 'https://api.github.com/users/web-flow/repos',
            events_url:
              'https://api.github.com/users/web-flow/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/web-flow/received_events',
            type: 'User',
            site_admin: false,
          },
          parents: [
            {
              sha: '0ae818d52f9cc2ccbcb3ca03bfbc21d9d35758a9',
              url: 'https://api.github.com/repos/kadena-community/kadena.js/commits/0ae818d52f9cc2ccbcb3ca03bfbc21d9d35758a9',
              html_url:
                'https://github.com/kadena-community/kadena.js/commit/0ae818d52f9cc2ccbcb3ca03bfbc21d9d35758a9',
            },
          ],
          stats: {
            total: 134,
            additions: 123,
            deletions: 11,
          },
          files: [
            {
              sha: 'bc9e4c3cf4cb1ebfaa3be4fab7c7ba76dc50fdd1',
              filename: '.changeset/breezy-swans-joke.md',
              status: 'added',
              additions: 5,
              deletions: 0,
              changes: 5,
              blob_url:
                'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/.changeset%2Fbreezy-swans-joke.md',
              raw_url:
                'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/.changeset%2Fbreezy-swans-joke.md',
              contents_url:
                'https://api.github.com/repos/kadena-community/kadena.js/contents/.changeset%2Fbreezy-swans-joke.md?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
              patch:
                '@@ -0,0 +1,5 @@\n+---\n+"@kadena/react-ui": patch\n+---\n+\n+Added proper sizes for the dialog',
            },
            {
              sha: '3ada1d1b180945ebcd1d2970ad270839f02d363a',
              filename:
                'packages/libs/react-ui/src/components/Dialog/Dialog.css.ts',
              status: 'modified',
              additions: 55,
              deletions: 4,
              changes: 59,
              blob_url:
                'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.css.ts',
              raw_url:
                'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.css.ts',
              contents_url:
                'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.css.ts?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
              patch:
                "@@ -34,10 +34,6 @@ export const overlayClass = style([\n       maxHeight: '75vh',\n     },\n   }),\n-  {\n-    backdropFilter: 'blur(12px)',\n-    cursor: 'default',\n-  },\n ]);\n \n export const closeButtonClass = style([\n@@ -65,6 +61,14 @@ export const titleWrapperClass = style([\n   }),\n ]);\n \n+export const subtitleWrapperClass = style([\n+  atoms({\n+    marginBlockEnd: 'sm',\n+    fontWeight: 'primaryFont.light',\n+    color: 'text.gray.default',\n+  }),\n+]);\n+\n export const footerClass = style([atoms({ flexShrink: 0 })]);\n \n export const contentClass = style([\n@@ -78,3 +82,50 @@ export const contentClass = style([\n     marginRight: calc(tokens.kda.foundation.spacing.xxl).negate().toString(),\n   },\n ]);\n+\n+export const smClass = style([\n+  responsiveStyle({\n+    xs: {\n+      maxHeight: '100svh',\n+      maxWidth: '100vw',\n+    },\n+    sm: {\n+      maxHeight: '100svh',\n+      maxWidth: '100vw',\n+    },\n+    md: {\n+      maxWidth: tokens.kda.foundation.layout.content.maxWidth,\n+      maxHeight: '75vh',\n+    },\n+  }),\n+]);\n+\n+const smallSizes = {\n+  xs: {\n+    height: '100svh',\n+    maxWidth: '100vw',\n+  },\n+  sm: {\n+    height: '100svh',\n+    maxWidth: '100vw',\n+  },\n+};\n+export const mdClass = style([\n+  responsiveStyle({\n+    ...smallSizes,\n+    md: {\n+      maxHeight: '84svh',\n+      maxWidth: '60vw',\n+    },\n+  }),\n+]);\n+\n+export const lgClass = style([\n+  responsiveStyle({\n+    ...smallSizes,\n+    md: {\n+      maxHeight: '96svh',\n+      maxWidth: '84vw',\n+    },\n+  }),\n+]);",
            },
            {
              sha: 'ddaecc3b694a856640a8997847b11d6a8ba34faf',
              filename:
                'packages/libs/react-ui/src/components/Dialog/Dialog.stories.tsx',
              status: 'modified',
              additions: 13,
              deletions: 2,
              changes: 15,
              blob_url:
                'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.stories.tsx',
              raw_url:
                'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.stories.tsx',
              contents_url:
                'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.stories.tsx?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
              patch:
                "@@ -3,9 +3,10 @@ import React, { useState } from 'react';\n import { Button } from '../Button';\n import type { IDialogProps } from '../Dialog';\n import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog';\n+import { DialogHeaderSubtitle } from './DialogHeaderSubtitle';\n import { ModalContent } from './StoryComponents';\n \n-type DialogStoryProps = IDialogProps & { title: string };\n+type DialogStoryProps = IDialogProps & { title: string; subtitle: string };\n \n const meta: Meta<DialogStoryProps> = {\n   title: 'Overlays/Dialog',\n@@ -45,6 +46,13 @@ A Dialog is a type of modal that is used to display information or prompt the us\n         type: { summary: 'string' },\n       },\n     },\n+    size: {\n+      control: {\n+        type: 'radio',\n+      },\n+      options: ['sm', 'md', 'lg'],\n+      defaultValue: 'md',\n+    },\n   },\n };\n \n@@ -55,19 +63,22 @@ export const DialogStory: Story = {\n   name: 'Dialog',\n   args: {\n     title: 'Dialog Title',\n+    subtitle: 'Dialog subtitle',\n   },\n-  render: ({ title }) => {\n+  render: ({ title, subtitle, size }) => {\n     const [isOpen, setIsOpen] = useState(false);\n \n     return (\n       <>\n         <Button onClick={() => setIsOpen(true)}>Modal Trigger</Button>\n         <Dialog\n           isOpen={isOpen}\n+          size={size}\n           onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}\n         >\n           {(state) => (\n             <>\n+              <DialogHeaderSubtitle>{subtitle}</DialogHeaderSubtitle>\n               <DialogHeader>{title}</DialogHeader>\n               <DialogContent>\n                 <ModalContent />",
            },
            {
              sha: '8125863e38dfdd4bd2b359303e0c6e40d80f5106',
              filename:
                'packages/libs/react-ui/src/components/Dialog/Dialog.tsx',
              status: 'modified',
              additions: 22,
              deletions: 3,
              changes: 25,
              blob_url:
                'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.tsx',
              raw_url:
                'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.tsx',
              contents_url:
                'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.tsx?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
              patch:
                "@@ -10,18 +10,37 @@ import { useOverlayTriggerState } from 'react-stately';\n import type { IModalProps } from '../Modal/Modal';\n import { Modal } from '../Modal/Modal';\n import { DialogContext } from './Dialog.context';\n-import { closeButtonClass, overlayClass } from './Dialog.css';\n+import {\n+  closeButtonClass,\n+  lgClass,\n+  mdClass,\n+  overlayClass,\n+  smClass,\n+} from './Dialog.css';\n \n+const sizeMap = {\n+  sm: smClass,\n+  md: mdClass,\n+  lg: lgClass,\n+};\n interface IBaseDialogProps\n   extends Omit<IModalProps, 'children'>,\n     AriaDialogProps {\n   children?: ((state: OverlayTriggerState) => ReactNode) | ReactNode;\n   className?: string;\n+  size?: keyof typeof sizeMap;\n }\n \n const BaseDialog = React.forwardRef<HTMLDivElement, IBaseDialogProps>(\n   (props, ref) => {\n-    const { className, children, isDismissable = true, state, ...rest } = props;\n+    const {\n+      className,\n+      children,\n+      isDismissable = true,\n+      size = 'md',\n+      state,\n+      ...rest\n+    } = props;\n     const dialogRef = useObjectRef<HTMLDivElement | null>(ref);\n     const { dialogProps, titleProps } = useDialog(\n       {\n@@ -35,7 +54,7 @@ const BaseDialog = React.forwardRef<HTMLDivElement, IBaseDialogProps>(\n       <DialogContext.Provider value={{ titleProps, state }}>\n         <div\n           ref={dialogRef}\n-          className={cn(overlayClass, className)}\n+          className={cn(overlayClass, className, sizeMap[size])}\n           {...mergeProps(rest, dialogProps)}\n         >\n           {typeof children === 'function' ? children(state) : children}",
            },
            {
              sha: '5fb071c85fee758399b95bbb6cce02e23b722814',
              filename:
                'packages/libs/react-ui/src/components/Dialog/DialogHeaderSubtitle.tsx',
              status: 'added',
              additions: 23,
              deletions: 0,
              changes: 23,
              blob_url:
                'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialogHeaderSubtitle.tsx',
              raw_url:
                'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialogHeaderSubtitle.tsx',
              contents_url:
                'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialogHeaderSubtitle.tsx?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
              patch:
                "@@ -0,0 +1,23 @@\n+import cn from 'classnames';\n+import type { FC } from 'react';\n+import React, { useContext } from 'react';\n+import { Heading } from '../Typography';\n+import { DialogContext } from './Dialog.context';\n+import { subtitleWrapperClass } from './Dialog.css';\n+import type { IDialogHeaderProps } from './DialogHeader';\n+\n+export const DialogHeaderSubtitle: FC<IDialogHeaderProps> = ({\n+  children,\n+  className,\n+}) => {\n+  const { titleProps } = useContext(DialogContext);\n+  return (\n+    <div className={cn(subtitleWrapperClass, className)} {...titleProps}>\n+      {typeof children === 'string' ? (\n+        <Heading as=\"h6\">{children}</Heading>\n+      ) : (\n+        children\n+      )}\n+    </div>\n+  );\n+};",
            },
            {
              sha: '19f1bdcd7e2850aaec6a1ef22e05cdd0c825019b',
              filename: 'packages/libs/react-ui/src/components/Dialog/index.ts',
              status: 'modified',
              additions: 1,
              deletions: 0,
              changes: 1,
              blob_url:
                'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2Findex.ts',
              raw_url:
                'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2Findex.ts',
              contents_url:
                'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2Findex.ts?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
              patch:
                "@@ -6,4 +6,5 @@ export { DialogFooter } from './DialogFooter';\n export type { IDialogFooterProps } from './DialogFooter';\n export { DialogHeader } from './DialogHeader';\n export type { IDialogHeaderProps } from './DialogHeader';\n+export { DialogHeaderSubtitle } from './DialogHeaderSubtitle';\n export { useDialog } from './useDialog';",
            },
            {
              sha: '7375b767e15dfe4c8594578b1ebcc5576cfe1ea5',
              filename:
                'packages/libs/react-ui/src/components/Modal/Modal.css.ts',
              status: 'modified',
              additions: 2,
              deletions: 2,
              changes: 4,
              blob_url:
                'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FModal%2FModal.css.ts',
              raw_url:
                'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FModal%2FModal.css.ts',
              contents_url:
                'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FModal%2FModal.css.ts?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
              patch:
                "@@ -8,9 +8,9 @@ export const underlayClass = style([\n     justifyContent: 'center',\n     position: 'fixed',\n     inset: 0,\n+    backgroundColor: 'base.default',\n   }),\n   {\n-    // TODO: Update to use token\n-    backgroundColor: 'rgba(26, 26, 26, 0.8)',\n+    backdropFilter: 'blur(12px)',\n   },\n ]);",
            },
            {
              sha: 'ec2c513380a399d93e7fd07fbd76619d8c3912f1',
              filename: 'packages/libs/react-ui/src/components/index.ts',
              status: 'modified',
              additions: 1,
              deletions: 0,
              changes: 1,
              blob_url:
                'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2Findex.ts',
              raw_url:
                'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2Findex.ts',
              contents_url:
                'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2Findex.ts?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
              patch:
                "@@ -66,6 +66,7 @@ export {\n   DialogContent,\n   DialogFooter,\n   DialogHeader,\n+  DialogHeaderSubtitle,\n   useDialog,\n } from './Dialog';\n export { Divider } from './Divider/Divider';",
            },
            {
              sha: '43ba54115287c0a5e4544c8b696524a5b274d790',
              filename: 'packages/libs/react-ui/src/index.ts',
              status: 'modified',
              additions: 1,
              deletions: 0,
              changes: 1,
              blob_url:
                'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Findex.ts',
              raw_url:
                'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Findex.ts',
              contents_url:
                'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Findex.ts?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
              patch:
                '@@ -69,6 +69,7 @@ export {\n   DialogContent,\n   DialogFooter,\n   DialogHeader,\n+  DialogHeaderSubtitle,\n   Divider,\n   Form,\n   FormFieldHeader,',
            },
          ],
        },
      };

      const result = reduceCommitData(data);

      const expetedResult = {
        status: 200,
        headers: {
          'last-modified': 'Wed, 08 May 2024 14:47:15 GMT',
          date: 'Fri, 17 May 2024 09:07:27 GMT',
        },
        data: {
          sha: 'b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
          url: 'https://api.github.com/repos/kadena-community/kadena.js/commits/b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
          html_url:
            'https://github.com/kadena-community/kadena.js/commit/b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
          author: {
            login: 'ferreroltd',
            id: 73488793,
            avatar_url: 'https://avatars.githubusercontent.com/u/73488793?v=4',
            html_url: 'https://github.com/ferreroltd',
            url: 'https://api.github.com/users/ferreroltd',
          },
          comments_url:
            'https://api.github.com/repos/kadena-community/kadena.js/commits/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/comments',
          commit: { message: 'Feat/dialog sizes (#2076)', comment_count: 0 },
        },
      };

      expect(result).toEqual(expetedResult);
    });
  });
  describe('reduceCommitDataCommit', () => {
    it('should only return the properties that we need of the commit data', () => {
      const data: IGithubCommitDataCommit = {
        sha: 'b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
        node_id:
          'C_kwDOHRRhtdoAKGIwNjkyOWRjYzIxMzZlZWNmMWY4N2I3N2UxNzEyYTNlOTFlZDQ3ZjQ',
        commit: {
          author: {
            name: 'ferreroltd',
            email: '73488793+ferreroltd@users.noreply.github.com',
            date: '2024-05-08T14:47:15Z',
          },
          committer: {
            name: 'GitHub',
            email: 'noreply@github.com',
            date: '2024-05-08T14:47:15Z',
          },
          message: 'Feat/dialog sizes (#2076)',
          tree: {
            sha: '248fe09792d041c426efe83f5e4485403789ed63',
            url: 'https://api.github.com/repos/kadena-community/kadena.js/git/trees/248fe09792d041c426efe83f5e4485403789ed63',
          },
          url: 'https://api.github.com/repos/kadena-community/kadena.js/git/commits/b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
          comment_count: 0,
          verification: {
            verified: true,
            reason: 'valid',
            signature:
              '-----BEGIN PGP SIGNATURE-----\n\nwsFcBAABCAAQBQJmO5BzCRC1aQ7uu5UhlAAANYAQAGrXSbiLvlbet2lVo10owxwy\nA/5J4ehM2YezdSByIGDfXvczeY340jlqrdv2604FoNp5lOelRYcljUHahM2O7vHo\naNaF9/eiB1+hck5JOczlTbesVJGdQGwE1kYsDs1Ntn9487Ef/XKjTsp2Pc+vTVTu\nIbk2plDpoijalW/X+It4Kug7uQyZdLz0OJgCsJlthgnBPKPd7UTKpubYKPMEN5i6\nwwkBVvP9fT1ByFXF6uACboVdc0miK5CEkK21zDRPrQKwCPU3TcG5pxAdSAQZC/Ws\ngCvAIyu4WEBPR2VhQr55UszMaIbR76Q7mR2iTMrZJxanfRcfj385Ggyx3T1GF+tK\nJtjli4XaCwnTaxru0mozTwFcP5M6xFnQcElcUxLSisZCbX/VpDH9rSIOJ4yrmTKs\nTOEX2xkjiVOUr+N2rIFi1q2m9RSGyV7rSJiPe+DH2PTNh9srsrEuh/ZF7vUW5vNQ\nwYf3Yx8tQlzlZq+y3grQg3edR0MgTO20qYnDmcciHbxdUcPLmTWeMnZCwuzehtr2\nG1NuJyGF/2okZVvWuzvfLL7g369X/ekSpzt2kYjb15n0+bqsrOYyYbpLjIk8Tobq\nDcPTT+lCJF3/XdDQlDy+uZYInY/vQcrlOHVbMVzAx7Vi+SL0U3hlP2mOzrOBExF9\nYxgwdwZRsqzvJGz/Ccze\n=qdCR\n-----END PGP SIGNATURE-----\n',
            payload:
              'tree 248fe09792d041c426efe83f5e4485403789ed63\nparent 0ae818d52f9cc2ccbcb3ca03bfbc21d9d35758a9\nauthor ferreroltd <73488793+ferreroltd@users.noreply.github.com> 1715179635 +0100\ncommitter GitHub <noreply@github.com> 1715179635 +0200\n\nFeat/dialog sizes (#2076)\n\n',
          },
        },
        url: 'https://api.github.com/repos/kadena-community/kadena.js/commits/b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
        html_url:
          'https://github.com/kadena-community/kadena.js/commit/b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
        comments_url:
          'https://api.github.com/repos/kadena-community/kadena.js/commits/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/comments',
        author: {
          login: 'ferreroltd',
          id: 73488793,
          node_id: 'MDQ6VXNlcjczNDg4Nzkz',
          avatar_url: 'https://avatars.githubusercontent.com/u/73488793?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/ferreroltd',
          html_url: 'https://github.com/ferreroltd',
          followers_url: 'https://api.github.com/users/ferreroltd/followers',
          following_url:
            'https://api.github.com/users/ferreroltd/following{/other_user}',
          gists_url: 'https://api.github.com/users/ferreroltd/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/ferreroltd/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/ferreroltd/subscriptions',
          organizations_url: 'https://api.github.com/users/ferreroltd/orgs',
          repos_url: 'https://api.github.com/users/ferreroltd/repos',
          events_url:
            'https://api.github.com/users/ferreroltd/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/ferreroltd/received_events',
          type: 'User',
          site_admin: false,
        },
        committer: {
          login: 'web-flow',
          id: 19864447,
          node_id: 'MDQ6VXNlcjE5ODY0NDQ3',
          avatar_url: 'https://avatars.githubusercontent.com/u/19864447?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/web-flow',
          html_url: 'https://github.com/web-flow',
          followers_url: 'https://api.github.com/users/web-flow/followers',
          following_url:
            'https://api.github.com/users/web-flow/following{/other_user}',
          gists_url: 'https://api.github.com/users/web-flow/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/web-flow/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/web-flow/subscriptions',
          organizations_url: 'https://api.github.com/users/web-flow/orgs',
          repos_url: 'https://api.github.com/users/web-flow/repos',
          events_url: 'https://api.github.com/users/web-flow/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/web-flow/received_events',
          type: 'User',
          site_admin: false,
        },
        parents: [
          {
            sha: '0ae818d52f9cc2ccbcb3ca03bfbc21d9d35758a9',
            url: 'https://api.github.com/repos/kadena-community/kadena.js/commits/0ae818d52f9cc2ccbcb3ca03bfbc21d9d35758a9',
            html_url:
              'https://github.com/kadena-community/kadena.js/commit/0ae818d52f9cc2ccbcb3ca03bfbc21d9d35758a9',
          },
        ],
        stats: {
          total: 134,
          additions: 123,
          deletions: 11,
        },
        files: [
          {
            sha: 'bc9e4c3cf4cb1ebfaa3be4fab7c7ba76dc50fdd1',
            filename: '.changeset/breezy-swans-joke.md',
            status: 'added',
            additions: 5,
            deletions: 0,
            changes: 5,
            blob_url:
              'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/.changeset%2Fbreezy-swans-joke.md',
            raw_url:
              'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/.changeset%2Fbreezy-swans-joke.md',
            contents_url:
              'https://api.github.com/repos/kadena-community/kadena.js/contents/.changeset%2Fbreezy-swans-joke.md?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
            patch:
              '@@ -0,0 +1,5 @@\n+---\n+"@kadena/react-ui": patch\n+---\n+\n+Added proper sizes for the dialog',
          },
          {
            sha: '3ada1d1b180945ebcd1d2970ad270839f02d363a',
            filename:
              'packages/libs/react-ui/src/components/Dialog/Dialog.css.ts',
            status: 'modified',
            additions: 55,
            deletions: 4,
            changes: 59,
            blob_url:
              'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.css.ts',
            raw_url:
              'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.css.ts',
            contents_url:
              'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.css.ts?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
            patch:
              "@@ -34,10 +34,6 @@ export const overlayClass = style([\n       maxHeight: '75vh',\n     },\n   }),\n-  {\n-    backdropFilter: 'blur(12px)',\n-    cursor: 'default',\n-  },\n ]);\n \n export const closeButtonClass = style([\n@@ -65,6 +61,14 @@ export const titleWrapperClass = style([\n   }),\n ]);\n \n+export const subtitleWrapperClass = style([\n+  atoms({\n+    marginBlockEnd: 'sm',\n+    fontWeight: 'primaryFont.light',\n+    color: 'text.gray.default',\n+  }),\n+]);\n+\n export const footerClass = style([atoms({ flexShrink: 0 })]);\n \n export const contentClass = style([\n@@ -78,3 +82,50 @@ export const contentClass = style([\n     marginRight: calc(tokens.kda.foundation.spacing.xxl).negate().toString(),\n   },\n ]);\n+\n+export const smClass = style([\n+  responsiveStyle({\n+    xs: {\n+      maxHeight: '100svh',\n+      maxWidth: '100vw',\n+    },\n+    sm: {\n+      maxHeight: '100svh',\n+      maxWidth: '100vw',\n+    },\n+    md: {\n+      maxWidth: tokens.kda.foundation.layout.content.maxWidth,\n+      maxHeight: '75vh',\n+    },\n+  }),\n+]);\n+\n+const smallSizes = {\n+  xs: {\n+    height: '100svh',\n+    maxWidth: '100vw',\n+  },\n+  sm: {\n+    height: '100svh',\n+    maxWidth: '100vw',\n+  },\n+};\n+export const mdClass = style([\n+  responsiveStyle({\n+    ...smallSizes,\n+    md: {\n+      maxHeight: '84svh',\n+      maxWidth: '60vw',\n+    },\n+  }),\n+]);\n+\n+export const lgClass = style([\n+  responsiveStyle({\n+    ...smallSizes,\n+    md: {\n+      maxHeight: '96svh',\n+      maxWidth: '84vw',\n+    },\n+  }),\n+]);",
          },
          {
            sha: 'ddaecc3b694a856640a8997847b11d6a8ba34faf',
            filename:
              'packages/libs/react-ui/src/components/Dialog/Dialog.stories.tsx',
            status: 'modified',
            additions: 13,
            deletions: 2,
            changes: 15,
            blob_url:
              'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.stories.tsx',
            raw_url:
              'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.stories.tsx',
            contents_url:
              'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.stories.tsx?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
            patch:
              "@@ -3,9 +3,10 @@ import React, { useState } from 'react';\n import { Button } from '../Button';\n import type { IDialogProps } from '../Dialog';\n import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog';\n+import { DialogHeaderSubtitle } from './DialogHeaderSubtitle';\n import { ModalContent } from './StoryComponents';\n \n-type DialogStoryProps = IDialogProps & { title: string };\n+type DialogStoryProps = IDialogProps & { title: string; subtitle: string };\n \n const meta: Meta<DialogStoryProps> = {\n   title: 'Overlays/Dialog',\n@@ -45,6 +46,13 @@ A Dialog is a type of modal that is used to display information or prompt the us\n         type: { summary: 'string' },\n       },\n     },\n+    size: {\n+      control: {\n+        type: 'radio',\n+      },\n+      options: ['sm', 'md', 'lg'],\n+      defaultValue: 'md',\n+    },\n   },\n };\n \n@@ -55,19 +63,22 @@ export const DialogStory: Story = {\n   name: 'Dialog',\n   args: {\n     title: 'Dialog Title',\n+    subtitle: 'Dialog subtitle',\n   },\n-  render: ({ title }) => {\n+  render: ({ title, subtitle, size }) => {\n     const [isOpen, setIsOpen] = useState(false);\n \n     return (\n       <>\n         <Button onClick={() => setIsOpen(true)}>Modal Trigger</Button>\n         <Dialog\n           isOpen={isOpen}\n+          size={size}\n           onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}\n         >\n           {(state) => (\n             <>\n+              <DialogHeaderSubtitle>{subtitle}</DialogHeaderSubtitle>\n               <DialogHeader>{title}</DialogHeader>\n               <DialogContent>\n                 <ModalContent />",
          },
          {
            sha: '8125863e38dfdd4bd2b359303e0c6e40d80f5106',
            filename: 'packages/libs/react-ui/src/components/Dialog/Dialog.tsx',
            status: 'modified',
            additions: 22,
            deletions: 3,
            changes: 25,
            blob_url:
              'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.tsx',
            raw_url:
              'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.tsx',
            contents_url:
              'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialog.tsx?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
            patch:
              "@@ -10,18 +10,37 @@ import { useOverlayTriggerState } from 'react-stately';\n import type { IModalProps } from '../Modal/Modal';\n import { Modal } from '../Modal/Modal';\n import { DialogContext } from './Dialog.context';\n-import { closeButtonClass, overlayClass } from './Dialog.css';\n+import {\n+  closeButtonClass,\n+  lgClass,\n+  mdClass,\n+  overlayClass,\n+  smClass,\n+} from './Dialog.css';\n \n+const sizeMap = {\n+  sm: smClass,\n+  md: mdClass,\n+  lg: lgClass,\n+};\n interface IBaseDialogProps\n   extends Omit<IModalProps, 'children'>,\n     AriaDialogProps {\n   children?: ((state: OverlayTriggerState) => ReactNode) | ReactNode;\n   className?: string;\n+  size?: keyof typeof sizeMap;\n }\n \n const BaseDialog = React.forwardRef<HTMLDivElement, IBaseDialogProps>(\n   (props, ref) => {\n-    const { className, children, isDismissable = true, state, ...rest } = props;\n+    const {\n+      className,\n+      children,\n+      isDismissable = true,\n+      size = 'md',\n+      state,\n+      ...rest\n+    } = props;\n     const dialogRef = useObjectRef<HTMLDivElement | null>(ref);\n     const { dialogProps, titleProps } = useDialog(\n       {\n@@ -35,7 +54,7 @@ const BaseDialog = React.forwardRef<HTMLDivElement, IBaseDialogProps>(\n       <DialogContext.Provider value={{ titleProps, state }}>\n         <div\n           ref={dialogRef}\n-          className={cn(overlayClass, className)}\n+          className={cn(overlayClass, className, sizeMap[size])}\n           {...mergeProps(rest, dialogProps)}\n         >\n           {typeof children === 'function' ? children(state) : children}",
          },
          {
            sha: '5fb071c85fee758399b95bbb6cce02e23b722814',
            filename:
              'packages/libs/react-ui/src/components/Dialog/DialogHeaderSubtitle.tsx',
            status: 'added',
            additions: 23,
            deletions: 0,
            changes: 23,
            blob_url:
              'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialogHeaderSubtitle.tsx',
            raw_url:
              'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialogHeaderSubtitle.tsx',
            contents_url:
              'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2FDialogHeaderSubtitle.tsx?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
            patch:
              "@@ -0,0 +1,23 @@\n+import cn from 'classnames';\n+import type { FC } from 'react';\n+import React, { useContext } from 'react';\n+import { Heading } from '../Typography';\n+import { DialogContext } from './Dialog.context';\n+import { subtitleWrapperClass } from './Dialog.css';\n+import type { IDialogHeaderProps } from './DialogHeader';\n+\n+export const DialogHeaderSubtitle: FC<IDialogHeaderProps> = ({\n+  children,\n+  className,\n+}) => {\n+  const { titleProps } = useContext(DialogContext);\n+  return (\n+    <div className={cn(subtitleWrapperClass, className)} {...titleProps}>\n+      {typeof children === 'string' ? (\n+        <Heading as=\"h6\">{children}</Heading>\n+      ) : (\n+        children\n+      )}\n+    </div>\n+  );\n+};",
          },
          {
            sha: '19f1bdcd7e2850aaec6a1ef22e05cdd0c825019b',
            filename: 'packages/libs/react-ui/src/components/Dialog/index.ts',
            status: 'modified',
            additions: 1,
            deletions: 0,
            changes: 1,
            blob_url:
              'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2Findex.ts',
            raw_url:
              'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2Findex.ts',
            contents_url:
              'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FDialog%2Findex.ts?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
            patch:
              "@@ -6,4 +6,5 @@ export { DialogFooter } from './DialogFooter';\n export type { IDialogFooterProps } from './DialogFooter';\n export { DialogHeader } from './DialogHeader';\n export type { IDialogHeaderProps } from './DialogHeader';\n+export { DialogHeaderSubtitle } from './DialogHeaderSubtitle';\n export { useDialog } from './useDialog';",
          },
          {
            sha: '7375b767e15dfe4c8594578b1ebcc5576cfe1ea5',
            filename:
              'packages/libs/react-ui/src/components/Modal/Modal.css.ts',
            status: 'modified',
            additions: 2,
            deletions: 2,
            changes: 4,
            blob_url:
              'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FModal%2FModal.css.ts',
            raw_url:
              'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FModal%2FModal.css.ts',
            contents_url:
              'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2FModal%2FModal.css.ts?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
            patch:
              "@@ -8,9 +8,9 @@ export const underlayClass = style([\n     justifyContent: 'center',\n     position: 'fixed',\n     inset: 0,\n+    backgroundColor: 'base.default',\n   }),\n   {\n-    // TODO: Update to use token\n-    backgroundColor: 'rgba(26, 26, 26, 0.8)',\n+    backdropFilter: 'blur(12px)',\n   },\n ]);",
          },
          {
            sha: 'ec2c513380a399d93e7fd07fbd76619d8c3912f1',
            filename: 'packages/libs/react-ui/src/components/index.ts',
            status: 'modified',
            additions: 1,
            deletions: 0,
            changes: 1,
            blob_url:
              'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2Findex.ts',
            raw_url:
              'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2Findex.ts',
            contents_url:
              'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Fcomponents%2Findex.ts?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
            patch:
              "@@ -66,6 +66,7 @@ export {\n   DialogContent,\n   DialogFooter,\n   DialogHeader,\n+  DialogHeaderSubtitle,\n   useDialog,\n } from './Dialog';\n export { Divider } from './Divider/Divider';",
          },
          {
            sha: '43ba54115287c0a5e4544c8b696524a5b274d790',
            filename: 'packages/libs/react-ui/src/index.ts',
            status: 'modified',
            additions: 1,
            deletions: 0,
            changes: 1,
            blob_url:
              'https://github.com/kadena-community/kadena.js/blob/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Findex.ts',
            raw_url:
              'https://github.com/kadena-community/kadena.js/raw/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/packages%2Flibs%2Freact-ui%2Fsrc%2Findex.ts',
            contents_url:
              'https://api.github.com/repos/kadena-community/kadena.js/contents/packages%2Flibs%2Freact-ui%2Fsrc%2Findex.ts?ref=b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
            patch:
              '@@ -69,6 +69,7 @@ export {\n   DialogContent,\n   DialogFooter,\n   DialogHeader,\n+  DialogHeaderSubtitle,\n   Divider,\n   Form,\n   FormFieldHeader,',
          },
        ],
      };

      const result = reduceCommitDataCommit(data);

      const expetedResult = {
        sha: 'b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
        url: 'https://api.github.com/repos/kadena-community/kadena.js/commits/b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
        html_url:
          'https://github.com/kadena-community/kadena.js/commit/b06929dcc2136eecf1f87b77e1712a3e91ed47f4',
        author: {
          login: 'ferreroltd',
          id: 73488793,
          avatar_url: 'https://avatars.githubusercontent.com/u/73488793?v=4',
          html_url: 'https://github.com/ferreroltd',
          url: 'https://api.github.com/users/ferreroltd',
        },
        comments_url:
          'https://api.github.com/repos/kadena-community/kadena.js/commits/b06929dcc2136eecf1f87b77e1712a3e91ed47f4/comments',
        commit: { message: 'Feat/dialog sizes (#2076)', comment_count: 0 },
      };

      expect(result).toEqual(expetedResult);
    });
  });
  describe('getAuthor', () => {
    it('should return the correct author from commit.author if it exists', () => {
      const commit = {
        sha: '111',
        author: {
          login: 'He-man',
          id: 1,
          node_id: '1',
          avatar_url:
            'https://www.writeups.org/wp-content/uploads/He-Man-Masters-Universe-portrait-featured.jpg',
          url: 'https://en.wikipedia.org/wiki/List_of_He-Man_and_the_Masters_of_the_Universe_characters',
        },
        committer: {
          login: 'Teela-Na',
          id: 2,
          node_id: '2',
          avatar_url:
            'https://upload.wikimedia.org/wikipedia/en/6/66/Teela1980s.jpg',
          url: 'https://en.wikipedia.org/wiki/List_of_He-Man_and_the_Masters_of_the_Universe_characters',
        },
        commit: {
          author: {
            name: 'skeletor',
            email: 'skeletor@greyskull.com',
          },
          committer: {
            name: 'cringer',
            email: 'cringer@hotmail.com',
          },
        },
      } as IGithubCommitDataCommit;
      const result = getAuthor(commit);
      const expectedResult = {
        login: 'He-man',
        id: 1,
        avatar_url:
          'https://www.writeups.org/wp-content/uploads/He-Man-Masters-Universe-portrait-featured.jpg',
        url: 'https://en.wikipedia.org/wiki/List_of_He-Man_and_the_Masters_of_the_Universe_characters',
      };

      expect(result).toEqual(expectedResult);
    });

    it('should return the correct author from commit.committer if it exists and commit.author is undefined', () => {
      const commit = {
        sha: '111',
        committer: {
          login: 'Teela-Na',
          id: 2,
          node_id: '2',
          avatar_url:
            'https://upload.wikimedia.org/wikipedia/en/6/66/Teela1980s.jpg',
          url: 'https://en.wikipedia.org/wiki/List_of_He-Man_and_the_Masters_of_the_Universe_characters',
        },
        commit: {
          author: {
            name: 'skeletor',
            email: 'skeletor@greyskull.com',
          },
          committer: {
            name: 'cringer',
            email: 'cringer@hotmail.com',
          },
        },
      } as IGithubCommitDataCommit;
      const result = getAuthor(commit);
      const expectedResult = {
        login: 'Teela-Na',
        id: 2,
        avatar_url:
          'https://upload.wikimedia.org/wikipedia/en/6/66/Teela1980s.jpg',
        url: 'https://en.wikipedia.org/wiki/List_of_He-Man_and_the_Masters_of_the_Universe_characters',
      };

      expect(result).toEqual(expectedResult);
    });

    it('should return the correct author from commit.commit.author if it exists and commit.author and commit.committer are undefined', () => {
      const commit = {
        sha: '111',
        commit: {
          author: {
            name: 'skeletor',
            email: 'skeletor@greyskull.com',
          },
          committer: {
            name: 'cringer',
            email: 'cringer@hotmail.com',
          },
        },
      } as IGithubCommitDataCommit;
      const result = getAuthor(commit);
      const expectedResult = {
        login: 'skeletor',
      };

      expect(result).toEqual(expectedResult);
    });

    it('should return the correct author from commit.commit.committer if it exists and commit.author and commit.committer and commit.commit.author are undefined', () => {
      const commit = {
        sha: '111',
        commit: {
          committer: {
            name: 'cringer',
            email: 'cringer@hotmail.com',
          },
        },
      } as IGithubCommitDataCommit;
      const result = getAuthor(commit);
      const expectedResult = {
        login: 'cringer',
      };

      expect(result).toEqual(expectedResult);
    });

    it('should return an empty user, if there is no info', () => {
      const commit = {
        sha: '111',
        commit: {},
      } as IGithubCommitDataCommit;
      const result = getAuthor(commit);
      const expectedResult = undefined;

      expect(result).toEqual(expectedResult);
    });
  });
  describe('reduceUserData', () => {
    it('should only return the properties that we need of the use', () => {
      const user: IGitHubUser = {
        login: 'Skeletor',
        id: 6686385,
        node_id: '11111',
        avatar_url: 'https://avatars.githubusercontent.com/u/11111?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Skeletor',
        html_url: 'https://github.com/Skeletor',
        followers_url: 'https://api.github.com/users/Skeletor/followers',
        following_url:
          'https://api.github.com/users/Skeletor/following{/other_user}',
        gists_url: 'https://api.github.com/users/Skeletor/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/Skeletor/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/Skeletor/subscriptions',
        organizations_url: 'https://api.github.com/users/Skeletor/orgs',
        repos_url: 'https://api.github.com/users/Skeletor/repos',
        events_url: 'https://api.github.com/users/Skeletor/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/Skeletor/received_events',
        type: 'User',
        site_admin: false,
      };

      const result = reduceUserData(user);
      const expetedResult = {
        login: 'Skeletor',
        id: 6686385,
        avatar_url: 'https://avatars.githubusercontent.com/u/11111?v=4',
        html_url: 'https://github.com/Skeletor',
        url: 'https://api.github.com/users/Skeletor',
      };

      expect(result).toEqual(expetedResult);
    });
  });
  describe('reduceHeaderData', () => {
    it('should only return the properties that we need of the header', () => {
      const headers: IGitHubHeader = {
        'access-control-allow-origin': '*',
        'access-control-expose-headers':
          'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset',
        'cache-control': 'private, max-age=60, s-maxage=60',
        'content-encoding': 'gzip',
        'content-security-policy': "default-src 'none'",
        'content-type': 'application/json; charset=utf-8',
        date: 'Fri, 17 May 2024 08:32:59 GMT',
        etag: 'W/"670e5030f30f8754a81a6e18b537572ccf9b309efcb0bfdbe36993817f42f9df"',
        'github-authentication-token-expiration': '2024-05-21 10:10:40 UTC',
        'last-modified': 'Thu, 25 Apr 2024 11:56:07 GMT',
        'referrer-policy':
          'origin-when-cross-origin, strict-origin-when-cross-origin',
        server: 'GitHub.com',
        'strict-transport-security':
          'max-age=31536000; includeSubdomains; preload',
        'transfer-encoding': 'chunked',
        vary: 'Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With',
        'x-accepted-oauth-scopes': '',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'deny',
        'x-github-api-version-selected': '2022-11-28',
        'x-github-media-type': 'github.v3; format=json',
        'x-github-request-id': 'DEFF:2E0EEA:6D6A96D:6E054CA:6647163A',
        'x-oauth-scopes':
          'public_repo, repo:invite, repo:status, repo_deployment',
        'x-ratelimit-limit': '5000',
        'x-ratelimit-remaining': '4993',
        'x-ratelimit-reset': '1715938348',
        'x-ratelimit-resource': 'core',
        'x-ratelimit-used': '7',
        'x-xss-protection': '0',
      };

      const result = reduceHeaderData(headers);
      const expetedResult = {
        date: 'Fri, 17 May 2024 08:32:59 GMT',
        'last-modified': 'Thu, 25 Apr 2024 11:56:07 GMT',
      };

      expect(result).toEqual(expetedResult);
    });
  });
});
