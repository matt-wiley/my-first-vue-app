import type ParsedFeed from "@/models/parsedFeed";

interface ContentTestData {
  feedUrl: string;
  initialData: {
    sourceXml: string;
    expectedParsedFeed: ParsedFeed
  },
  latestData: {
    sourceXml: string;
    expectedParsedFeed: ParsedFeed
  }
}

export const GitHubStatusAtomFeed: ContentTestData = {

  feedUrl: "https://www.githubstatus.com/history.atom",
  initialData: {
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>
<feed xml:lang="en-US" xmlns="http://www.w3.org/2005/Atom">
  <id>tag:www.githubstatus.com,2005:/history</id>
  <link rel="alternate" type="text/html" href="https://www.githubstatus.com"/>
  <link rel="self" type="application/atom+xml" href="https://www.githubstatus.com/history.atom"/>
  <title>GitHub Status - Incident History</title>
  <updated>2024-06-24T07:42:46Z</updated>
  <author>
    <name>GitHub</name>
  </author>
  <entry>
    <id>tag:www.githubstatus.com,2005:Incident/21148992</id>
    <published>2024-06-18T18:09:43Z</published>
    <updated>2024-06-21T19:43:13Z</updated>
    <link rel="alternate" type="text/html" href="https://www.githubstatus.com/incidents/k1mlxlmdhqqp"/>
    <title>We are investigating degraded performance for GitHub Enterprise Importer migrations</title>
    <content type="html">&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt;18&lt;/var&gt;, &lt;var data-var='time'&gt;18:09&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - Starting on June 18th from 4:59pm UTC to 6:06pm UTC, customer migrations were unavailable and failing. This impacted all in-progress migration during that time. This issue was due to an incorrect configuration on our Database cluster. We mitigated the issue by remediating the database configuration and are working with stakeholders to ensure safeguards are in place to prevent the issue going forward.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt;18&lt;/var&gt;, &lt;var data-var='time'&gt;18:04&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We have applied a configuration change to our migration service as a mitigation and are beginning to see recovery and in increase in successful migration runs. We are continuing to monitor.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt;18&lt;/var&gt;, &lt;var data-var='time'&gt;17:48&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We have identified what we believe to be the source of the migration errors and are applying a mitigation, which we expect will begin improving migration success rate.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt;18&lt;/var&gt;, &lt;var data-var='time'&gt;17:15&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We are investigating degraded performance for GitHub Enterprise Importer migrations. Some customers may see an increase in failed migrations. Investigation is ongoing.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt;18&lt;/var&gt;, &lt;var data-var='time'&gt;17:14&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are currently investigating this issue.&lt;/p&gt;</content>
  </entry>
  <entry>
    <id>tag:www.githubstatus.com,2005:Incident/21078205</id>
    <published>2024-06-11T21:39:47Z</published>
    <updated>2024-06-14T05:48:37Z</updated>
    <link rel="alternate" type="text/html" href="https://www.githubstatus.com/incidents/lfrlwdg67fn8"/>
    <title>Incident with Actions</title>
    <content type="html">&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt;11&lt;/var&gt;, &lt;var data-var='time'&gt;21:39&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - On June 11th, 2024 between 20:13 UTC and 21:39 UTC, the GitHub Actions service was degraded. A security-related change applied by one of our third-party providers prevented new customers from onboarding to GitHub Actions and caused an average 28% of Actions jobs to fail.&lt;br /&gt;&lt;br /&gt;We mitigated the incident by working with the third-party provider to revert the change and are working with their engineering team to fully understand the root cause. Additionally, we are improving communication between GitHub and our service providers to reduce the time needed to resolve similar issues in the future.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt;11&lt;/var&gt;, &lt;var data-var='time'&gt;21:35&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We've applied a mitigation to unblock running Actions and are seeing an improvement in our service availability.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt;11&lt;/var&gt;, &lt;var data-var='time'&gt;21:16&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - Customers may see issues running Actions, we are in the process of applying a mitigation to restore our service.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt;11&lt;/var&gt;, &lt;var data-var='time'&gt;20:34&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - Customers may see issues running Actions&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt;11&lt;/var&gt;, &lt;var data-var='time'&gt;20:33&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are investigating reports of degraded performance for Actions and API Requests&lt;/p&gt;</content>
  </entry>
  <entry>
    <id>tag:www.githubstatus.com,2005:Incident/21015719</id>
    <published>2024-06-06T04:43:52Z</published>
    <updated>2024-06-07T22:05:34Z</updated>
    <link rel="alternate" type="text/html" href="https://www.githubstatus.com/incidents/fr6wzzpg0bsv"/>
    <title>Incident with Packages</title>
    <content type="html">&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 6&lt;/var&gt;, &lt;var data-var='time'&gt;04:43&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - On June 6, 2024 between 03:29 and 04:19 UTC, the service responsible for the Maven package registry was degraded. This affected GitHub customers who were trying to upload packages to the Maven package registry.&lt;br /&gt;&lt;br /&gt;We observed increased database pressure due to bulk operations in progress, and at 04:19 UTC, the Maven upload issues resolved when those bulk operations finished. We're continuing to assess any additional compounding factors.&lt;br /&gt;&lt;br /&gt;We are working on improving our thresholds for existing alerts to reduce our time to detection and mitigation of issues like this one in the future.&lt;br /&gt;&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 6&lt;/var&gt;, &lt;var data-var='time'&gt;04:38&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We were alerted to problems in maven uploads. These have now improved, and we're continuing to monitor and investigate.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 6&lt;/var&gt;, &lt;var data-var='time'&gt;04:21&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We are investigating reports of issues with Packages. We will continue to keep users updated on progress towards mitigation.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 6&lt;/var&gt;, &lt;var data-var='time'&gt;04:21&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are investigating reports of degraded performance for Packages&lt;/p&gt;</content>
  </entry>
  <entry> <!-- Freshness.Stale Entry -->
    <id>tag:www.githubstatus.com,2005:Incident/21009829</id>
    <published>2024-06-05T19:27:21Z</published>
    <updated>2024-06-05T19:27:21Z</updated>
    <link rel="alternate" type="text/html" href="https://www.githubstatus.com/incidents/9zxft4pnrhbt"/>
    <title>Incident with Issues</title>
    <content type="html">&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 5&lt;/var&gt;, &lt;var data-var='time'&gt;19:27&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - This incident has been resolved.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 5&lt;/var&gt;, &lt;var data-var='time'&gt;19:27&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - Issues is operating normally.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 5&lt;/var&gt;, &lt;var data-var='time'&gt;19:19&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We continue to troubleshoot the problem with issues timeline.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 5&lt;/var&gt;, &lt;var data-var='time'&gt;18:47&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We continue to troubleshoot the problem with issues timeline.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 5&lt;/var&gt;, &lt;var data-var='time'&gt;18:01&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We're continuing to investigate the problem.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 5&lt;/var&gt;, &lt;var data-var='time'&gt;17:26&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We're seeing issues related to the issues timeline service, we're investigating and we will continue to keep users updated on progress towards mitigation.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var='date'&gt; 5&lt;/var&gt;, &lt;var data-var='time'&gt;17:22&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are investigating reports of degraded availability for Issues&lt;/p&gt;</content>
  </entry>
</feed>
    `,
    expectedParsedFeed: {
      "source": {
        "title": "GitHub Status - Incident History",
        "url": "https://www.githubstatus.com",
        "feedUrl": "https://www.githubstatus.com/history.atom",
        "description": "",
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
        },
        {
          "externalId": "tag:www.githubstatus.com,2005:Incident/21015719",
          "title": "Incident with Packages",
          "date": new Date("2024-06-07T22:05:34.000Z"),
          "author": "GitHub",
          "link": "https://www.githubstatus.com/incidents/fr6wzzpg0bsv",
          "content": "<p><small>Jun <var data-var='date'> 6</var>, <var data-var='time'>04:43</var> UTC</small><br><strong>Resolved</strong> - On June 6, 2024 between 03:29 and 04:19 UTC, the service responsible for the Maven package registry was degraded. This affected GitHub customers who were trying to upload packages to the Maven package registry.<br /><br />We observed increased database pressure due to bulk operations in progress, and at 04:19 UTC, the Maven upload issues resolved when those bulk operations finished. We're continuing to assess any additional compounding factors.<br /><br />We are working on improving our thresholds for existing alerts to reduce our time to detection and mitigation of issues like this one in the future.<br /></p><p><small>Jun <var data-var='date'> 6</var>, <var data-var='time'>04:38</var> UTC</small><br><strong>Update</strong> - We were alerted to problems in maven uploads. These have now improved, and we're continuing to monitor and investigate.</p><p><small>Jun <var data-var='date'> 6</var>, <var data-var='time'>04:21</var> UTC</small><br><strong>Update</strong> - We are investigating reports of issues with Packages. We will continue to keep users updated on progress towards mitigation.</p><p><small>Jun <var data-var='date'> 6</var>, <var data-var='time'>04:21</var> UTC</small><br><strong>Investigating</strong> - We are investigating reports of degraded performance for Packages</p>"
        },
        {
          "externalId": "tag:www.githubstatus.com,2005:Incident/21009829",
          "title": "Incident with Issues",
          "date": new Date("2024-06-05T19:27:21.000Z"),
          "author": "GitHub",
          "link": "https://www.githubstatus.com/incidents/9zxft4pnrhbt",
          "content": "<p><small>Jun <var data-var='date'> 5</var>, <var data-var='time'>19:27</var> UTC</small><br><strong>Resolved</strong> - This incident has been resolved.</p><p><small>Jun <var data-var='date'> 5</var>, <var data-var='time'>19:27</var> UTC</small><br><strong>Update</strong> - Issues is operating normally.</p><p><small>Jun <var data-var='date'> 5</var>, <var data-var='time'>19:19</var> UTC</small><br><strong>Update</strong> - We continue to troubleshoot the problem with issues timeline.</p><p><small>Jun <var data-var='date'> 5</var>, <var data-var='time'>18:47</var> UTC</small><br><strong>Update</strong> - We continue to troubleshoot the problem with issues timeline.</p><p><small>Jun <var data-var='date'> 5</var>, <var data-var='time'>18:01</var> UTC</small><br><strong>Update</strong> - We're continuing to investigate the problem.</p><p><small>Jun <var data-var='date'> 5</var>, <var data-var='time'>17:26</var> UTC</small><br><strong>Update</strong> - We're seeing issues related to the issues timeline service, we're investigating and we will continue to keep users updated on progress towards mitigation.</p><p><small>Jun <var data-var='date'> 5</var>, <var data-var='time'>17:22</var> UTC</small><br><strong>Investigating</strong> - We are investigating reports of degraded availability for Issues</p>"
        }
      ]
    }
  },
  latestData: {
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>GitHub Status - Incident History</title>
    <link>https://www.githubstatus.com</link>
    <description>Statuspage</description>
    <pubDate>Mon, 24 Jun 2024 07:42:46 +0000</pubDate>
    <item>
      <title>Incident with Copilot Pull Request Summaries</title>
      <description>
&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;19&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;12:53&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - Between June 18th, 2024 at 09:34 PM UTC and June 19th, 2024 at 12:53 PM the Copilot Pull Request Summaries Service was unavailable. This was due to an internal change in access approach from the Copilot Pull Request service to the Copilot API.&lt;br /&gt;&lt;br /&gt;We mitigated the incident by reverting the change in access which immediately resolved the errors.&lt;br /&gt;&lt;br /&gt;We are working to improve our monitoring in this area and reduce our time to detection to more quickly address issues like this one in the future.&lt;br /&gt;&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;19&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;12:31&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We are deploying a fix now and expect recovery within the hour.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;19&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;11:59&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We’ve identified an issue with Copilot pull request summaries that has caused errors when attempting to generate summaries since yesterday (June 18, 2024) at around 21:00 UTC. &lt;br /&gt;&lt;br /&gt;We have identified a fix, and we expect the issue to be resolved within two hours.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;19&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;11:58&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are investigating reports of degraded performance for Copilot&lt;/p&gt;      </description>
      <pubDate>Wed, 19 Jun 2024 12:53:33 +0000</pubDate>
      <link>https://www.githubstatus.com/incidents/nzc328r69wrv</link>
      <guid>https://www.githubstatus.com/incidents/nzc328r69wrv</guid>
    </item>
    <item>
      <title>We are investigating degraded performance for GitHub Enterprise Importer migrations</title>
      <description>
&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;18&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;18:09&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - Starting on June 18th from 4:59pm UTC to 6:06pm UTC, customer migrations were unavailable and failing. This impacted all in-progress migration during that time. This issue was due to an incorrect configuration on our Database cluster. We mitigated the issue by remediating the database configuration and are working with stakeholders to ensure safeguards are in place to prevent the issue going forward.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;18&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;18:04&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We have applied a configuration change to our migration service as a mitigation and are beginning to see recovery and in increase in successful migration runs. We are continuing to monitor.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;18&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:48&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We have identified what we believe to be the source of the migration errors and are applying a mitigation, which we expect will begin improving migration success rate.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;18&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:15&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We are investigating degraded performance for GitHub Enterprise Importer migrations. Some customers may see an increase in failed migrations. Investigation is ongoing.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;18&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:14&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are currently investigating this issue.&lt;/p&gt;      </description>
      <pubDate>Tue, 18 Jun 2024 18:09:43 +0000</pubDate>
      <link>https://www.githubstatus.com/incidents/k1mlxlmdhqqp</link>
      <guid>https://www.githubstatus.com/incidents/k1mlxlmdhqqp</guid>
    </item>
    <item>
      <title>Incident with Actions</title>
      <description>
&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;11&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;21:39&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - On June 11th, 2024 between 20:13 UTC and 21:39 UTC, the GitHub Actions service was degraded. A security-related change applied by one of our third-party providers prevented new customers from onboarding to GitHub Actions and caused an average 28% of Actions jobs to fail.&lt;br /&gt;&lt;br /&gt;We mitigated the incident by working with the third-party provider to revert the change and are working with their engineering team to fully understand the root cause. Additionally, we are improving communication between GitHub and our service providers to reduce the time needed to resolve similar issues in the future.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;11&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;21:35&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We&apos;ve applied a mitigation to unblock running Actions and are seeing an improvement in our service availability.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;11&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;21:16&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - Customers may see issues running Actions, we are in the process of applying a mitigation to restore our service.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;11&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;20:34&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - Customers may see issues running Actions&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt;11&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;20:33&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are investigating reports of degraded performance for Actions and API Requests&lt;/p&gt;      </description>
      <pubDate>Tue, 11 Jun 2024 21:39:47 +0000</pubDate>
      <link>https://www.githubstatus.com/incidents/lfrlwdg67fn8</link>
      <guid>https://www.githubstatus.com/incidents/lfrlwdg67fn8</guid>
    </item>
    <item>
      <title>Incident with Packages</title>
      <description>
&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 6&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;04:43&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - On June 6, 2024 between 03:29 and 04:19 UTC, the service responsible for the Maven package registry was degraded. This affected GitHub customers who were trying to upload packages to the Maven package registry.&lt;br /&gt;&lt;br /&gt;We observed increased database pressure due to bulk operations in progress, and at 04:19 UTC, the Maven upload issues resolved when those bulk operations finished. We&apos;re continuing to assess any additional compounding factors.&lt;br /&gt;&lt;br /&gt;We are working on improving our thresholds for existing alerts to reduce our time to detection and mitigation of issues like this one in the future.&lt;br /&gt;&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 6&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;04:38&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We were alerted to problems in maven uploads. These have now improved, and we&apos;re continuing to monitor and investigate.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 6&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;04:21&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We are investigating reports of issues with Packages. We will continue to keep users updated on progress towards mitigation.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 6&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;04:21&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are investigating reports of degraded performance for Packages&lt;/p&gt;      </description>
      <pubDate>Thu, 06 Jun 2024 04:43:52 +0000</pubDate>
      <link>https://www.githubstatus.com/incidents/fr6wzzpg0bsv</link>
      <guid>https://www.githubstatus.com/incidents/fr6wzzpg0bsv</guid>
    </item>
    <item>
      <title>Incident with Issues</title>
      <description>
&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 5&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;19:27&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - This incident has been resolved.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 5&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;19:27&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - Issues is operating normally.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 5&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;19:19&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We continue to troubleshoot the problem with issues timeline.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 5&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;18:47&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We continue to troubleshoot the problem with issues timeline.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 5&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;18:01&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We&apos;re continuing to investigate the problem.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 5&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:26&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We&apos;re seeing issues related to the issues timeline service, we&apos;re investigating and we will continue to keep users updated on progress towards mitigation.&lt;/p&gt;&lt;p&gt;&lt;small&gt;Jun &lt;var data-var=&apos;date&apos;&gt; 5&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:22&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are investigating reports of degraded availability for Issues&lt;/p&gt;      </description>
      <pubDate>Wed, 05 Jun 2024 19:27:21 +0000</pubDate>
      <link>https://www.githubstatus.com/incidents/9zxft4pnrhbt</link>
      <guid>https://www.githubstatus.com/incidents/9zxft4pnrhbt</guid>
    </item>
    <item>
      <title>Incident with Copilot</title>
      <description>
&lt;p&gt;&lt;small&gt;May &lt;var data-var=&apos;date&apos;&gt;30&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:22&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Resolved&lt;/strong&gt; - This incident has been resolved.&lt;/p&gt;&lt;p&gt;&lt;small&gt;May &lt;var data-var=&apos;date&apos;&gt;30&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:22&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - Copilot is operating normally.&lt;/p&gt;&lt;p&gt;&lt;small&gt;May &lt;var data-var=&apos;date&apos;&gt;30&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:22&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - We have rolled out mitigation and fixes appear to be stable. This incident has been resolved.&lt;/p&gt;&lt;p&gt;&lt;small&gt;May &lt;var data-var=&apos;date&apos;&gt;30&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:14&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - Copilot is experiencing degraded performance. We are continuing to investigate.&lt;/p&gt;&lt;p&gt;&lt;small&gt;May &lt;var data-var=&apos;date&apos;&gt;30&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:14&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Update&lt;/strong&gt; - Our CoPilot API is currently experiencing back-end connectivity issues and we are actively engaged in mitigation steps.&lt;/p&gt;&lt;p&gt;&lt;small&gt;May &lt;var data-var=&apos;date&apos;&gt;30&lt;/var&gt;, &lt;var data-var=&apos;time&apos;&gt;17:14&lt;/var&gt; UTC&lt;/small&gt;&lt;br&gt;&lt;strong&gt;Investigating&lt;/strong&gt; - We are currently investigating this issue.&lt;/p&gt;      </description>
      <pubDate>Thu, 30 May 2024 17:22:55 +0000</pubDate>
      <link>https://www.githubstatus.com/incidents/g8g6c6s72836</link>
      <guid>https://www.githubstatus.com/incidents/g8g6c6s72836</guid>
    </item>
  </channel>
</rss>
`,
    expectedParsedFeed: {} as ParsedFeed, // TODO: Add data here
  }
}
