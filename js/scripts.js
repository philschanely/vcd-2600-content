$(function(){

    bootstrapify();

    loadPages(".lesson-content", "h3");

});

function bootstrapify() {
    $("table").addClass("table");
    $("img").addClass("img-responsive");
}

function loadPages(_context, _marker) {

    // Define the lessons object on which to store the list of pages
    var lesson = {
        pages: [],
        length: 0
    };

    // Create list of pages based on the provided markers
    $(_context + " " + _marker).each(function(i,o){

        // Set up variables to store this item, the current next item and the overall content set
        var $this = $(o);
        var $next = $this.next();
        var content = "";

        // Loop through all neighboring elements until the next marker
        while ($next.length > 0 && $next[0].localName != _marker) {

            // Add this item's content
            content += $next[0].outerHTML;

            // Get the next item
            $next = $next.next();
        }

        // Set up the properties of this page
        var page = {
            number: i+1,
            title: $this.html(),
            content: content,
            class: i == 0 ? "active" : ""
        };

        // Add this page to the overall list of pages
        lesson.pages.push(page);
        lesson.length++;
    });

    console.log(lesson);

    // Load the lesson/page navigation template
    $.get("/templates/lesson.tpl.html", function(data){

        // Inject data in the template that was loaded
        var tpl = Handlebars.compile(data);
        var lessonHTML = $(tpl(lesson));

        // Add the template to the page in place of existing content
        $(_context).replaceWith(lessonHTML);

        // Set up event listeners
        $(_context).on("click", function(e){
            e.preventDefault();
            var $target = $(e.target);
            if ($target.hasClass("subnav-link") || $target.hasClass("page-nav-link")) {
                var targetPageNum = Number($target.attr("href").replace("#page-", ""));

                // Remove all active classes
                $(_context + " .active").removeClass("active");

                // Add active classes to the target elements
                $($target.attr("href")).addClass("active");
                $(".subnav-link[href='" + $target.attr("href") + "']").closest("li").addClass("active");

                // Update next and back navigation
                var nextPageNum = targetPageNum+1;
                var prevPageNum = targetPageNum-1;
                if (nextPageNum > lesson.length) {
                    $(".pager .next").addClass("disabled");
                } else {
                    $(".pager .next a").attr("href", "#page-" + nextPageNum);
                    $(".pager .next").removeClass("disabled");
                }
                if (prevPageNum == 0) {
                    $(".pager .previous").addClass("disabled");
                } else {
                    $(".pager .previous a").attr("href", "#page-" + prevPageNum);
                    $(".pager .previous").removeClass("disabled");
                }
            }
        });
    });
}
