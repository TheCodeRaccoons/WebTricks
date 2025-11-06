<p  align="center">
	  <a href="https://github.com/TheCodeRaccoons/WebTricks/releases">
		  <img alt="GitHub release (latest by semver)" src="https://img.shields.io/github/v/release/TheCodeRaccoons/WebTricks?color=%2360be86&label=Latest%20release&style=for-the-badge&sort=semver">
	</a>
	<a href="/LICENSE">
		<img alt="GitHub" src="https://img.shields.io/github/license/TheCodeRaccoons/WebTricks?color=%2360be86&style=for-the-badge">
	</a>
	<a href="https://github.com/TheCodeRaccoons/WebTricks/graphs/contributors">
		<img alt="GitHub contributors" src="https://img.shields.io/github/contributors-anon/TheCodeRaccoons/WebTricks?color=%2360be86&style=for-the-badge">
	</a>
	<a href="https://github.com/TheCodeRaccoons/WebTricks/issues/new?assignees=&labels=Functionality+Request&projects=&template=request-functionality.yml&title=%5BFUNCTIONALITY+REQUEST%5D%3A+request+name">
		<img alt="GitHub issues by-label" src="https://img.shields.io/github/issues/TheCodeRaccoons/WebTricks/request:feature?color=%2360be86&label=feature%20requests&style=for-the-badge">
	</a>
	<a href="https://github.com/TheCodeRaccoons/WebTricks/stargazers">
		<img alt="GitHub repository stars" src="https://img.shields.io/github/stars/TheCodeRaccoons/WebTricks?color=%2360be86&label=github%20stars&style=for-the-badge">
	</a>
	<a href="#">
		<img alt="GitHub License" src="https://img.shields.io/github/license/TheCodeRaccoons/WebTricks?color=%2360be86&style=for-the-badge">
	</a>
	<a href="#">
		<img alt="Static Badge" src="https://img.shields.io/badge/monthly_hits-25k-a?color=%2360be86&style=for-the-badge">
	</a>
</p>
<br />
<div align="center">
    <a href="https://github.com/TheCodeRaccoons/WebTricks">
        <img src="https://raw.githubusercontent.com/TheCodeRaccoons/Imagery/16a395115ab598a94a7d1ab93f182218d8bbb751/wt-logo.svg" alt="WebTricks Logo" height="140" />
    </a>
    <h5 align="center">
	    WebTricks aims to create easy-to-implement, reusable functionalities for the web. The main platform this project was built for at the beginning was <a href="https://webflow.com/">Webflow</a>, but most of the scripts are made to work on any web development project. Meaning that most of the scripts should work without an issue on any website unless it is a CMS  ONLY functionality or a Webflow-Specific script.
    </h5>
    <p align="center">
        <a target="_blank" href="https://github.com/TheCodeRaccoons/WebTricks/issues/new/choose">Request a functionality</a>
        &middot;
        <a href="#contribute">Contribute</a>
        &middot;
        <a href="https://www.thecoderaccoons.com/webtricks">See the documentation</a>
    </p>
</div>

<h2>TL;DR</h2>
All of the documentation is explained by functionality in <a href="https://thecoderaccoons.com/webtricks">the website</a>. Feel free to browse there or request any aditional functionalities in the <a target="_blank" href="https://github.com/TheCodeRaccoons/WebTricks/issues/new/choose">issues</a> section of this project.
 
<h2>Table of Contents</h2>
<ol>
    <li><a href="#about">About the Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#request-functionality">Requesting a Functionality</a></li>
    <li><a href="#contribute">Contributing</a></li>
    <li><a href="#discord-community">Discord Community</a></li>
    <li><a href="#develop-vs-master"><code>develop</code> vs <code>master</code></a></li>
    <li><a href="#stale-prs">Stale Pull Requests</a></li>
</ol>

<h2 id="about">About the Project</h2>
<p>
	As any other developer using no-code web design tools I've struggled with the ability to bring specific, more complex functionalities to platforms like Webflow.
	<br/><br/>
	Over the past couple of years I started noticing some of this functionalities are not only commonly used but also requested by many in the community. WebTricks aims to empower developers and designers alike, provinding both simple and complex functionalities that could, in other cases, take longer to develop from scratch.
	<br/><br/>
    Webtricks is a lightweight JavaScript library designed to extend and overcome the limitations of no-code platforms like Webflow. It provides a collection of scripts that solve common challenges faced by developers and designers, offering enhanced functionality, dynamic interactions, and streamlined workflows without heavy dependencies.
    <br/><br/>
	This being said even though most of this functionalities are built for Webflow, there's many that can be used in any other web project and platform. Feel free to see the full <a href="https://coderacoons.webflow.io/webtricks">documentation</a> in my site for the complete list of functionalities and scripts available.
</p>
<sub>
   WebTricks might have been started as a personal project, but I'm a believer that a project for the comunity by the comunity can offer way more value than any single dev could provide so feel free to contribute to this project and use any solution here. <br>
	You can <a href="https://www.thecoderaccoons.com/webtricks">follow development and news here</a>
</sub>

<h2 id="getting-started">Getting Started</h2>
Direct Import via jsDelivr: Webtricks is hosted on jsDelivr, making it simple to include in your project. You can import individual functionalities directly into your HTML file. For example:

```
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/ReadTime.min.js"></script>
```
Replace CountUp.min.js with the specific script you want to include.

Multiple Scripts: Add as many scripts as you need to your project by referencing their respective paths. Example:

```
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/webtricks@1/dist/Functional/CMSFilter.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/webtricks@1/dist/Functional/FormCheck.min.js"></script>
```
Ready to Use: Once imported, the scripts initialize automatically, provided the correct HTML attributes are in place.

    
<h2 id="request-functionality">Requesting a functionality</h2>
<p>
    When you want to request a new functionality please feel free to create an issue. Check out our <a href="https://github.com/TheCodeRaccoons/WebTricks/wiki/Requesting-a-Finctionality">Wiki</a> for more information.
</p>

<h2 id="contribute">Contributing</h2>
<p>
    We are happy with every contribution, whether it's new functionalities, fixes, features, or maintainers. Please have a look at our <a href="https://github.com/TheCodeRaccoons/WebTricks/wiki">Wiki</a> to see how you can contribute to this project. When contributing make sure you follow the <a href="https://github.com/TheCodeRaccoons/WebTricks/wiki/Code-Standards">Code Standards</a> descrived in the project.
</p>

<h2 id="discord-community">Discord community</h2>
<p>
If the project get's enough usage I'm planning on building a community on discord. Where everyone can easily discuss, and have a good time talking with the community members, an official discord link will be released in a later date to allow the community to chat.
</p>

<h2 id="develop-vs-master"><code>develop</code> vs <code>master</code></h2>
<p>
All official releases shall be in <code>master</code>. Any updates in between (updates, new functionalities, features, etc.) will be kept in <code>develop</code>.
</p>
<b><code>develop</code> contains:</b>
<ul>
    <li>
        Latest functions, lightly optimized, throughly tested.
    </li>
    <li>
        No full docs in the website for this functions, they will be released with the latest release, though the dev branch will have it's own.<br>
    </li>
    <li>
        Experimental changes.
    </li>
</ul>
<b><code>master</code> contains:</b>
<ul>
    <li>
        Latest official release, including all functionalities, well optimized and under support.
    </li>
    <li>
        Official, well tested changes.
    </li>
</ul>

<h2 id="stale-prs">Stale Pull Requests</h2>
<p>
After a pull request has been open for over 30 days with no activity or response from the author, it'll be automatically marked as stale. We might fork your changes and merge the changes ourselves. Since GitHub tracks contributions by commits, you will be credited.
</p>
<br/>
<div align="center">
    <img src="https://forthebadge.com/images/badges/built-with-love.svg" />
    <img src="https://forthebadge.com/images/badges/built-by-developers.svg" />
</div>

