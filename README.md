# mindlessChat
Experiment using Hoodie

I stumbled across [Hoodie](http://hood.ie/) a while back, and the "no backend" approach with [CouchDB](http://wiki.apache.org/couchdb/) struck me as potentially worth investigation.  The out-of-the-box demonstration application (`hoodie new blah`) shows that the principle works for independent users.  But, to rebuild some obsolete tools that I've worked on over the years, I'm more interested in potential collaborateive aspects.

So, to demonstrate that, I figured that a chat application should be a viable first attempt.  Presumably, it's been done before, but the goal isn't to innovate so much as to see what it takes to build simple inter-user interaction from scratch.

That said, if this turns out useful to someone, by all means, take it with my AGPLed blessing...

## Libraries

From an example chat application, this now uses `global-share`, the [Global Share Plugin](https://github.com/hoodiehq/hoodie-plugin-global-share).  Unsurprisingly, this requires changing the architecture of the program from the default to-do list.

## What's Involved?

There were some false starts involved with (presumably) misunderstanding the `global share` documentation, but changes to the demonstration code involved some obvious HTML/CSS changes to _fit_ the concept and renaming away from any references to "To Do," and changing the various store add/update calls to call `.publish()`.  The other big change is creating an object model for messages that includes the user and timestamp.

I also needed a few changes---primarily due to the ad hoc development process---to filter out the old _To Do_ messages and any duplicate messages that seemed to appear.

Otherwise, it's pretty straightforward, and seems to point the way to public and private data.  Overall, probably a success.
