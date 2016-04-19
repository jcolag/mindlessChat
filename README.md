# mindlessChat
Experiment using Hoodie

I stumbled across [Hoodie](http://hood.ie/) a while back, and the "no backend" approach with [CouchDB](http://wiki.apache.org/couchdb/) struck me as potentially worth investigation.  The out-of-the-box demonstration application (`hoodie new blah`) shows that the principle works for independent users.  But, to rebuild some obsolete tools that I've worked on over the years, I'm more interested in potential collaborateive aspects.

So, to demonstrate that, I figured that a chat application should be a viable first attempt.  Presumably, it's been done before, but the goal isn't to innovate so much as to see what it takes to build simple inter-user interaction from scratch.

That said, if this turns out useful to someone, by all means, take it with my AGPLed blessing...

## Libraries

From an example chat application, this now uses `global-share`, the [Global Share Plugin](https://github.com/hoodiehq/hoodie-plugin-global-share).  Unsurprisingly, this requires changing the architecture of the program from the default to-do list.

