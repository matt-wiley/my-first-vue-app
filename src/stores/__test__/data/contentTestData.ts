import type ParsedFeed from "@/models/parsedFeed"

interface IMockDataForUpdates {
  [key: string]: {
    feedUrl: string;
    initialData: ParsedFeed;
    latestData: ParsedFeed;
  }
}


export const MockDataForUpdates: IMockDataForUpdates = {
  GithubStatusAtomFeed: {
    feedUrl: 'https://www.githubstatus.com/history.atom',
    initialData: {
      "source": {
        "title": "GitHub Status - Incident History",
        "url": "https://www.githubstatus.com",
        "feedUrl": 'https://www.githubstatus.com/history.atom',
      },
      "articles": [
        {
          "externalId": "tag:www.githubstatus.com,2005:Incident/21148992",
          "title": "We are investigating degraded performance for GitHub Enterprise Importer migrations",
          "date": new Date("2024-06-21T19:43:13.000Z"),
          "author": "GitHub",
          "link": "https://www.githubstatus.com/incidents/k1mlxlmdhqqp",
          "content": "<p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>18:09</var> UTC</small><br><strong>Resolved</strong> - Starting on June 18th from 4:59pm UTC to 6:06pm UTC, customer migrations were unavailable and failing. This impacted all in-progress migration during that time. This issue was due to an incorrect configuration on our Database cluster. We mitigated the issue by remediating the database configuration and are working with stakeholders to ensure safeguards are in place to prevent the issue going forward.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>18:04</var> UTC</small><br><strong>Update</strong> - We have applied a configuration change to our migration service as a mitigation and are beginning to see recovery and in increase in successful migration runs. We are continuing to monitor.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>17:48</var> UTC</small><br><strong>Update</strong> - We have identified what we believe to be the source of the migration errors and are applying a mitigation, which we expect will begin improving migration success rate.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>17:15</var> UTC</small><br><strong>Update</strong> - We are investigating degraded performance for GitHub Enterprise Importer migrations. Some customers may see an increase in failed migrations. Investigation is ongoing.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>17:14</var> UTC</small><br><strong>Investigating</strong> - We are currently investigating this issue.</p>"
        },
        {
          "externalId": "tag:www.githubstatus.com,2005:Incident/21078205",
          "title": "Incident with Actions",
          "date": new Date("2024-06-14T05:48:37.000Z"),
          "author": "GitHub",
          "link": "https://www.githubstatus.com/incidents/lfrlwdg67fn8",
          "content": "<p><small>Jun <var data-var='date'>11</var>, <var data-var='time'>21:39</var> UTC</small><br><strong>Resolved</strong> - On June 11th, 2024 between 20:13 UTC and 21:39 UTC, the GitHub Actions service was degraded. A security-related change applied by one of our third-party providers prevented new customers from onboarding to GitHub Actions and caused an average 28% of Actions jobs to fail.<br /><br />We mitigated the incident by working with the third-party provider to revert the change and are working with their engineering team to fully understand the root cause. Additionally, we are improving communication between GitHub and our service providers to reduce the time needed to resolve similar issues in the future.</p><p><small>Jun <var data-var='date'>11</var>, <var data-var='time'>21:35</var> UTC</small><br><strong>Update</strong> - We've applied a mitigation to unblock running Actions and are seeing an improvement in our service availability.</p><p><small>Jun <var data-var='date'>11</var>, <var data-var='time'>21:16</var> UTC</small><br><strong>Update</strong> - Customers may see issues running Actions, we are in the process of applying a mitigation to restore our service.</p><p><small>Jun <var data-var='date'>11</var>, <var data-var='time'>20:34</var> UTC</small><br><strong>Update</strong> - Customers may see issues running Actions</p><p><small>Jun <var data-var='date'>11</var>, <var data-var='time'>20:33</var> UTC</small><br><strong>Investigating</strong> - We are investigating reports of degraded performance for Actions and API Requests</p>"
        }
      ]
    },
    latestData: {
      "source": {
        "title": "GitHub Status - Incident History",
        "url": "https://www.githubstatus.com",
        "feedUrl": 'https://www.githubstatus.com/history.atom',
      },
      "articles": [
        {
          "externalId": "tag:www.githubstatus.com,2005:Incident/21156994",
          "title": "Incident with Copilot Pull Request Summaries",
          "date": new Date("2024-06-24T02:34:26.000Z"),
          "author": "GitHub",
          "link": "https://www.githubstatus.com/incidents/nzc328r69wrv",
          "content": "<p><small>Jun <var data-var='date'>19</var>, <var data-var='time'>12:53</var> UTC</small><br><strong>Resolved</strong> - Between June 18th, 2024 at 09:34 PM UTC and June 19th, 2024 at 12:53 PM the Copilot Pull Request Summaries Service was unavailable. This was due to an internal change in access approach from the Copilot Pull Request service to the Copilot API.<br /><br />We mitigated the incident by reverting the change in access which immediately resolved the errors.<br /><br />We are working to improve our monitoring in this area and reduce our time to detection to more quickly address issues like this one in the future.<br /></p><p><small>Jun <var data-var='date'>19</var>, <var data-var='time'>12:31</var> UTC</small><br><strong>Update</strong> - We are deploying a fix now and expect recovery within the hour.</p><p><small>Jun <var data-var='date'>19</var>, <var data-var='time'>11:59</var> UTC</small><br><strong>Update</strong> - We’ve identified an issue with Copilot pull request summaries that has caused errors when attempting to generate summaries since yesterday (June 18, 2024) at around 21:00 UTC. <br /><br />We have identified a fix, and we expect the issue to be resolved within two hours.</p><p><small>Jun <var data-var='date'>19</var>, <var data-var='time'>11:58</var> UTC</small><br><strong>Investigating</strong> - We are investigating reports of degraded performance for Copilot</p>"
        },
        {
          "externalId": "tag:www.githubstatus.com,2005:Incident/21148992",
          "title": "We are investigating degraded performance for GitHub Enterprise Importer migrations",
          "date": new Date("2024-06-21T19:43:13.000Z"),
          "author": "GitHub",
          "link": "https://www.githubstatus.com/incidents/k1mlxlmdhqqp",
          "content": "<p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>18:09</var> UTC</small><br><strong>Resolved</strong> - Starting on June 18th from 4:59pm UTC to 6:06pm UTC, customer migrations were unavailable and failing. This impacted all in-progress migration during that time. This issue was due to an incorrect configuration on our Database cluster. We mitigated the issue by remediating the database configuration and are working with stakeholders to ensure safeguards are in place to prevent the issue going forward.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>18:04</var> UTC</small><br><strong>Update</strong> - We have applied a configuration change to our migration service as a mitigation and are beginning to see recovery and in increase in successful migration runs. We are continuing to monitor.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>17:48</var> UTC</small><br><strong>Update</strong> - We have identified what we believe to be the source of the migration errors and are applying a mitigation, which we expect will begin improving migration success rate.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>17:15</var> UTC</small><br><strong>Update</strong> - We are investigating degraded performance for GitHub Enterprise Importer migrations. Some customers may see an increase in failed migrations. Investigation is ongoing.</p><p><small>Jun <var data-var='date'>18</var>, <var data-var='time'>17:14</var> UTC</small><br><strong>Investigating</strong> - We are currently investigating this issue.</p>"
        }
      ]
    }
  }
}