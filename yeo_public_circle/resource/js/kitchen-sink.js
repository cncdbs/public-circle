var myApp = new Framework7({
    modalTitle: 'Framework7',
    animateNavBackIcon: true,
    pushState:true,
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true,
});
// Add another view, which is in right panel
var rightView = myApp.addView('.view-right', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true
});

// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
    if (e.detail.xhr.requestUrl.indexOf('autocomplete-languages.json') >= 0) {
        // Don't show preloader for autocomplete demo requests
        return;
    }
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function (e) {
    if (e.detail.xhr.requestUrl.indexOf('autocomplete-languages.json') >= 0) {
        // Don't show preloader for autocomplete demo requests
        return;
    }
    myApp.hideIndicator();
});

// Callbacks for specific pages when it initialized
/* ===== Modals Page events  ===== */
myApp.onPageInit('modals', function (page) {
    $$('.demo-alert').on('click', function () {
        myApp.alert('Hello!');
    });
    $$('.demo-confirm').on('click', function () {
        myApp.confirm('Are you feel good today?', function () {
            myApp.alert('Great!');
        });
    });
    $$('.demo-prompt').on('click', function () {
        myApp.prompt('What is your name?', function (data) {
            // @data contains input value
            myApp.confirm('Are you sure that your name is ' + data + '?', function () {
                myApp.alert('Ok, your name is ' + data + ' ;)');
            });
        });
    });
    $$('.demo-login').on('click', function () {
        myApp.modalLogin('Enter your username and password', function (username, password) {
            myApp.alert('Thank you! Username: ' + username + ', password: ' + password);
        });
    });
    $$('.demo-password').on('click', function () {
        myApp.modalPassword('Enter your password', function (password) {
            myApp.alert('Thank you! Password: ' + password);
        });
    });
    $$('.demo-modals-stack').on('click', function () {
        // Open 5 alerts
        myApp.alert('Alert 1');
        myApp.alert('Alert 2');
        myApp.alert('Alert 3');
        myApp.alert('Alert 4');
        myApp.alert('Alert 5');
    });
    $$('.demo-picker-modal').on('click', function () {
        myApp.pickerModal('.picker-modal-demo');
    });
});

/* ===== Preloader Page events ===== */
myApp.onPageInit('preloader', function (page) {
    $$('.demo-indicator').on('click', function () {
        myApp.showIndicator();
        setTimeout(function () {
            myApp.hideIndicator();
        }, 2000);
    });
    $$('.demo-preloader').on('click', function () {
        myApp.showPreloader();
        setTimeout(function () {
            myApp.hidePreloader();
        }, 2000);
    });
    $$('.demo-preloader-custom').on('click', function () {
        myApp.showPreloader('My text...');
        setTimeout(function () {
            myApp.hidePreloader();
        }, 2000);
    });
});

/* ===== Swipe to delete events callback demo ===== */
myApp.onPageInit('swipe-delete', function (page) {
    $$('.demo-remove-callback').on('deleted', function () {
        myApp.alert('Thanks, item removed!');
    });
});
myApp.onPageInit('swipe-delete media-lists', function (page) {
    $$('.demo-reply').on('click', function () {
        myApp.alert('Reply');
    });
    $$('.demo-mark').on('click', function () {
        myApp.alert('Mark');
    });
    $$('.demo-forward').on('click', function () {
        myApp.alert('Forward');
    });
});


/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('swipe-delete modals media-lists', function (page) {
    var actionSheetButtons = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Here comes some optional description or warning for actions below',
                label: true
            },
            // First button
            {
                text: 'Alert',
                onClick: function () {
                    myApp.alert('He Hoou!');
                }
            },
            // Another red button
            {
                text: 'Nice Red Button ',
                color: 'red',
                onClick: function () {
                    myApp.alert('You have clicked red button!');
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel',
                bold: true
            }
        ]
    ];
    $$('.demo-actions').on('click', function (e) {
        myApp.actions(actionSheetButtons);
    });
    $$('.demo-actions-popover').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionSheetButtons);
    });

});

/* ===== Messages Page ===== */
myApp.onPageInit('messages', function (page) {
    var conversationStarted = false;
    var answers = [
        'Yes!',
        'No',
        'Hm...',
        'I am not sure',
        'And what about you?',
        'May be ;)',
        'Lorem ipsum dolor sit amet, consectetur',
        'What?',
        'Are you sure?',
        'Of course',
        'Need to think about it',
        'Amazing!!!',
    ];
    var people = [
        {
            name: 'Kate Johnson',
            avatar: 'http://lorempixel.com/output/people-q-c-100-100-9.jpg'
        },
        {
            name: 'Blue Ninja',
            avatar: 'http://lorempixel.com/output/people-q-c-100-100-7.jpg'
        },

    ];
    var answerTimeout, isFocused;

    // Initialize Messages
    var myMessages = myApp.messages('.messages');

    // Initialize Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');

    $$('.messagebar a.send-message').on('touchstart mousedown', function () {
        isFocused = document.activeElement && document.activeElement === myMessagebar.textarea[0];
    });
    $$('.messagebar a.send-message').on('click', function (e) {
        // Keep focused messagebar's textarea if it was in focus before
        if (isFocused) {
            e.preventDefault();
            myMessagebar.textarea[0].focus();
        }
        var messageText = myMessagebar.value();
        if (messageText.length === 0) {
            return;
        }
        // Clear messagebar
        myMessagebar.clear();

        // Add Message
        myMessages.addMessage({
            text: messageText,
            type: 'sent',
            day: !conversationStarted ? 'Today' : false,
            time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        });
        conversationStarted = true;
        // Add answer after timeout
        if (answerTimeout) clearTimeout(answerTimeout);
        answerTimeout = setTimeout(function () {
            var answerText = answers[Math.floor(Math.random() * answers.length)];
            var person = people[Math.floor(Math.random() * people.length)];
            myMessages.addMessage({
                text: answers[Math.floor(Math.random() * answers.length)],
                type: 'received',
                name: person.name,
                avatar: person.avatar
            });
        }, 2000);
    });
});

/* ===== Pull To Refresh Demo ===== */
myApp.onPageInit('pull-to-refresh', function (page) {
    // Dummy Content
    var songs = ['Yellow Submarine', 'Don\'t Stop Me Now', 'Billie Jean', 'Californication'];
    var authors = ['Beatles', 'Queen', 'Michael Jackson', 'Red Hot Chili Peppers'];
    // Pull to refresh content
    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
    // Add 'refresh' listener on it
    ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            var picURL = 'http://lorempixel.com/88/88/abstract/' + Math.round(Math.random() * 10);
            var song = songs[Math.floor(Math.random() * songs.length)];
            var author = authors[Math.floor(Math.random() * authors.length)];
            var linkHTML = '<li class="item-content">' +
                                '<div class="item-media"><img src="' + picURL + '" width="44"/></div>' +
                                '<div class="item-inner">' +
                                    '<div class="item-title-row">' +
                                        '<div class="item-title">' + song + '</div>' +
                                    '</div>' +
                                    '<div class="item-subtitle">' + author + '</div>' +
                                '</div>' +
                            '</li>';
            ptrContent.find('ul').prepend(linkHTML);
            // When loading done, we need to "close" it
            myApp.pullToRefreshDone();
        }, 2000);
    });
});

/* ===== Sortable page ===== */
myApp.onPageInit('sortable-list', function (page) {
    // Sortable toggler
    $$('.list-block.sortable').on('open', function () {
        $$('.toggle-sortable').text('Done');
    });
    $$('.list-block.sortable').on('close', function () {
        $$('.toggle-sortable').text('Edit');
    });
});

/* ===== Photo Browser Examples ===== */
// Create photoprobsers first:
var photoBrowserPhotos = [
	{
		url: 'img/beach.jpg',
		caption: 'Amazing beach in Goa, India'
	},
    'http://placekitten.com/1024/1024',
    'img/lock.jpg',
    {
        url: 'img/monkey.jpg',
        caption: 'I met this monkey in Chinese mountains'
    },
    {
        url: 'img/mountains.jpg',
        caption: 'Beautiful mountains in Zhangjiajie, China'
    }

];
var photoBrowserStandalone = myApp.photoBrowser({
    photos: photoBrowserPhotos
});
var photoBrowserPopup = myApp.photoBrowser({
    photos: photoBrowserPhotos,
    type: 'popup'
});
var photoBrowserPage = myApp.photoBrowser({
    photos: photoBrowserPhotos,
    type: 'page',
    backLinkText: 'Back'
});
var photoBrowserDark = myApp.photoBrowser({
    photos: photoBrowserPhotos,
    theme: 'dark'
});
var photoBrowserPopupDark = myApp.photoBrowser({
    photos: photoBrowserPhotos,
    theme: 'dark',
    type: 'popup'
});
var photoBrowserLazy = myApp.photoBrowser({
    photos: photoBrowserPhotos,
    lazyLoading: true,
    theme: 'dark'
});
myApp.onPageInit('photo-browser', function (page) {
    $$('.ks-pb-standalone').on('click', function () {
        photoBrowserStandalone.open();
    });
    $$('.ks-pb-popup').on('click', function () {
        photoBrowserPopup.open();
    });
    $$('.ks-pb-page').on('click', function () {
        photoBrowserPage.open();
    });
    $$('.ks-pb-popup-dark').on('click', function () {
        photoBrowserPopupDark.open();
    });
    $$('.ks-pb-standalone-dark').on('click', function () {
        photoBrowserDark.open();
    });
    $$('.ks-pb-lazy').on('click', function () {
        photoBrowserLazy.open();
    });
});

/* ===== Infinite Scroll Page ===== */
myApp.onPageInit('infinite-scroll', function (page) {
    // Loading trigger
    var loading = false;
    // Last loaded index, we need to pass it to script
    var lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
    // Attach 'infinite' event handler
    $$('.infinite-scroll').on('infinite', function () {
        // Exit, if loading in progress
        if (loading) return;
        // Set loading trigger
        loading = true;
        // Request some file with data
        $$.get('infinite-scroll-load.php', {leftIndex: lastLoadedIndex + 1}, function (data) {
            loading = false;
            if (data === '') {
                // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                myApp.detachInfiniteScroll($$('.infinite-scroll'));
            }
            else {
                // Append loaded elements to list block
                $$('.infinite-scroll .list-block ul').append(data);
                // Update last loaded index
                lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
            }
        });
    });
});

/* ===== Notifications Page ===== */
myApp.onPageInit('notifications', function (page) {
    $$('.ks-notification-simple').on('click', function () {
        myApp.addNotification({
            title: 'Framework7',
            message: 'This is a simple notification message with title and message'
        });
    });
    $$('.ks-notification-full').on('click', function () {
        myApp.addNotification({
            title: 'Framework7',
            subtitle: 'Notification subtitle',
            message: 'This is a simple notification message with custom icon and subtitle',
            media: '<i class="icon icon-f7"></i>'
        });
    });
    $$('.ks-notification-custom').on('click', function () {
        myApp.addNotification({
            title: 'My Awesome App',
            subtitle: 'New message from John Doe',
            message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
            media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">'
        });
    });
    $$('.ks-notification-callback').on('click', function () {
        myApp.addNotification({
            title: 'My Awesome App',
            subtitle: 'New message from John Doe',
            message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
            media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">',
            onClose: function () {
                myApp.alert('Notification closed');
            }
        });
    });
});

/* ===== Login screen page events ===== */
myApp.onPageInit('login-screen-embedded', function (page) {
    $$(page.container).find('.list-button').on('click', function () {
        var username = $$(page.container).find('input[name="username"]').val();
        var password = $$(page.container).find('input[name="password"]').val();
        myApp.alert('Username: ' + username + ', password: ' + password, function () {
            mainView.router.back();
        });
    });
});
$$('.login-screen').find('.list-button').on('click', function () {
    var username = $$('.login-screen').find('input[name="username"]').val();
    var password = $$('.login-screen').find('input[name="password"]').val();
    myApp.alert('Username: ' + username + ', password: ' + password, function () {
        myApp.closeModal('.login-screen');
    });
});

/* ===== Demo Popover ===== */
$$('.popover a').on('click', function () {
    myApp.closeModal('.popover');
});

/* ===== Color themes ===== */
myApp.onPageInit('color-themes', function (page) {
    var themes = 'theme-white theme-black theme-yellow theme-red theme-blue theme-green theme-pink theme-lightblue theme-orange theme-gray';
    var layouts = 'layout-dark layout-white';
    $$(page.container).find('.ks-color-theme').click(function () {
        $$('body').removeClass(themes).addClass('theme-' + $$(this).attr('data-theme'));
    });
    $$(page.container).find('.ks-layout-theme').click(function () {
        $$('body').removeClass(layouts).addClass('layout-' + $$(this).attr('data-theme'));
    });
});

/* ===== Virtual List ===== */
myApp.onPageInit('virtual-list', function (page) {
    // Generate array with 10000 demo items:
    var items = [];
    for (var i = 0; i < 10000; i++) {
        items.push({
            title: 'Item ' + i,
            subtitle: 'Subtitle ' + i
        });
    }

    // Create virtual list
    var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
        // Pass array with items
        items: items,
        // Custom search function for searchbar
        searchAll: function (query, items) {
            var found = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].title.indexOf(query) >= 0 || query.trim() === '') found.push(i);
            }
            return found; //return array with mathced indexes
        },
        // List item Template7 template
        template: '<li>' +
                    '<a href="#" class="item-link item-content">' +
                      '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                          '<div class="item-title">{{title}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">{{subtitle}}</div>' +
                      '</div>' +
                    '</a>' +
                  '</li>',
        // Item height
        height: 63,
    });
});
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('swiper-gallery', function (page) {
    var swiperTop = myApp.swiper('.ks-swiper-gallery-top', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 10
    });
    var swiperThumbs = myApp.swiper('.ks-swiper-gallery-thumbs', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        centeredSlides: true,
        touchRatio: 0.2,
        slideToClickedSlide: true
    });
    swiperTop.params.control = swiperThumbs;
    swiperThumbs.params.control = swiperTop;
});
/* ===== Calendar ===== */
myApp.onPageInit('calendar', function (page) {
    // Default
    var calendarDefault = myApp.calendar({
        input: '#ks-calendar-default',
    });
    // With custom date format
    var calendarDateFormat = myApp.calendar({
        input: '#ks-calendar-date-format',
        dateFormat: 'DD, MM dd, yyyy'
    });
    // With multiple values
    var calendarMultiple = myApp.calendar({
        input: '#ks-calendar-multiple',
        dateFormat: 'M dd yyyy',
        multiple: true
    });
    // Range Picker
    var calendarRange = myApp.calendar({
        input: '#ks-calendar-range',
        dateFormat: 'M dd yyyy',
        rangePicker: true
    });
    // Inline with custom toolbar
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];
    var calendarInline = myApp.calendar({
        container: '#ks-calendar-inline-container',
        value: [new Date()],
        weekHeader: false,
        toolbarTemplate:
            '<div class="toolbar calendar-custom-toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
                    '</div>' +
                    '<div class="center"></div>' +
                    '<div class="right">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
                    '</div>' +
                '</div>' +
            '</div>',
        onOpen: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
            $$('.calendar-custom-toolbar .left .link').on('click', function () {
                calendarInline.prevMonth();
            });
            $$('.calendar-custom-toolbar .right .link').on('click', function () {
                calendarInline.nextMonth();
            });
        },
        onMonthYearChangeStart: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
        }
    });
});

/* ===== Pickers ===== */
myApp.onPageInit('pickers', function (page) {
    
var goodsclass={};
    var deep1_ids=Array();
     deep1_ids.unshift(0);
    var deep1_names=Array();
    deep1_names.unshift('[不限]');

    var deep2_ids=Array();
    var deep2_names=Array();   

    var deep3_ids=Array();
    var deep3_names=Array();
    $$.ajax({
                url: 'http://apihaomai.runger.net/v1/goods/catalog',
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                   //goodsclass=data;
                        
                        $$.each(data['deep1'],function(gc_id,gc_name){
                            deep1_ids.push(gc_id);
                            deep1_names.push(gc_name);
                        });
                      
                        $$.each(data['deep2'],function(gc_pid,gc2){
                            deep2_ids[gc_pid]=Array(); 
                            deep2_ids[gc_pid].unshift(0);
                            deep2_names[gc_pid]=Array(); 
                            deep2_names[gc_pid].unshift('[不限]');
                            $$.each(gc2,function(gc_id,gc_name){
                                deep2_ids[gc_pid].push(gc_id);
                                deep2_names[gc_pid].push(gc_name);
                            });
                            //deep2_obj={idx:deep2_ids,names:deep2_name};
                        });
                        
                        $$.each(data['deep3'],function(gc_pid,gc3){
                             deep3_ids[gc_pid]=Array(); 
                             deep3_ids[gc_pid].unshift(0);
                             deep3_names[gc_pid]=Array(); 
                             deep3_names[gc_pid].unshift('[不限]');
                            $$.each(gc3,function(gc_id,gc_name){
                                 deep3_ids[gc_pid].push(gc_id);
                                 deep3_names[gc_pid].push(gc_name);
                            })
                             //deep3_obj={idx:deep3_ids,names:deep3_name};
                        });
                        
                }
            });

    
    var today = new Date();

   

    // Dependent values
    var carVendors = {
        Japanese : ['Honda', 'Lexus', 'Mazda', 'Nissan', 'Toyota'],
        German : ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Volvo'],
        American : ['Cadillac', 'Chrysler', 'Dodge', 'Ford']
    };


var emptyArr=Array();
    var pickerDependent = myApp.picker({
        input: '#ks-picker-dependent',
        rotateEffect: true,
        formatValue: function (picker, values) {
            /*if(values[2] ==undefined || values[2] ==null || values[2] =='0'){
                return values[1] ;
            }else{
                 return values[2];
            }*/
            return values[2]+'|'+values[1]+'|'+values[0];
           
        },
        cols: [
            {
                textAlign: 'left',
                values: deep1_ids,
                displayValues: deep1_names,
                textAlign: 'left',
                onChange: function (picker, gid) {
                    //alert(deep2_ids[gid]);
                    if(picker.cols[1].replaceValues ){
                        picker.cols[1].replaceValues(deep2_ids[gid],deep2_names[gid]);
                        picker.cols[2].replaceValues([0],['　　　　']);
                    }
                }
            },
            {
                values: [0],
                displayValues: ['　　　　'],
                textAlign: 'center',
                onChange: function (picker, gid2) {
                    if(picker.cols[2].replaceValues){
                        if(deep3_ids[gid2] != undefined ){
                             picker.cols[2].replaceValues(deep3_ids[gid2],deep3_names[gid2]);
                        }else{
                            picker.cols[2].replaceValues([0],['　　　　']);
                        }
                    }
                }
            },
            {
                values: [0],
                displayValues: ['　　　　'],
                textAlign: 'right',
            },
        ]
    });

     // iOS Device picker
    var pickerDevice = myApp.picker({
        input: '#ks-picker-device',
        cols: [
            {
                textAlign: 'center',
                values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
            }
        ]
    });

    // Describe yourself picker
    var pickerDescribe = myApp.picker({
        input: '#ks-picker-describe',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'left',
                values: ('Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot').split(' ')
            },
            {
                values: ('Man Luthor Woman Boy Girl Person Cutie Babe Raccoon').split(' ')
            },
        ]
    });
    // Custom Toolbar
    var pickerCustomToolbar = myApp.picker({
        input: '#ks-picker-custom-toolbar',
        rotateEffect: true,
        toolbarTemplate:
            '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" class="link toolbar-randomize-link">Randomize</a>' +
                    '</div>' +
                    '<div class="right">' +
                        '<a href="#" class="link close-picker">That\'s me</a>' +
                    '</div>' +
                '</div>' +
            '</div>',
        cols: [
            {
                values: ['Mr', 'Ms'],
            },
            {
                textAlign: 'left',
                values: ('Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot').split(' ')
            },
            {
                values: ('Man Luthor Woman Boy Girl Person Cutie Babe Raccoon').split(' ')
            },
        ],
        onOpen: function (picker) {
            picker.container.find('.toolbar-randomize-link').on('click', function () {
                var col0Values = picker.cols[0].values;
                var col0Random = col0Values[Math.floor(Math.random() * col0Values.length)];

                var col1Values = picker.cols[1].values;
                var col1Random = col1Values[Math.floor(Math.random() * col1Values.length)];

                var col2Values = picker.cols[2].values;
                var col2Random = col2Values[Math.floor(Math.random() * col2Values.length)];

                picker.setValue([col0Random, col1Random, col2Random]);
            });
        }
    });

    // Inline date-time
    var pickerInline = myApp.picker({
        input: '#ks-picker-date',
        container: '#ks-picker-date-container',
        toolbar: false,
        rotateEffect: true,
        value: [today.getMonth(), today.getDate(), today.getFullYear(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],
        onChange: function (picker, values, displayValues) {
            var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
            if (values[1] > daysInMonth) {
                picker.cols[1].setValue(daysInMonth);
            }
        },
        formatValue: function (p, values, displayValues) {
            return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
        },
        cols: [
            // Months
            {
                values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                displayValues: ('January February March April May June July August September October November December').split(' '),
                textAlign: 'left'
            },
            // Days
            {
                values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            },
            // Years
            {
                values: (function () {
                    var arr = [];
                    for (var i = 1950; i <= 2030; i++) { arr.push(i); }
                    return arr;
                })(),
            },
            // Space divider
            {
                divider: true,
                content: '&nbsp;&nbsp;'
            },
            // Hours
            {
                values: (function () {
                    var arr = [];
                    for (var i = 0; i <= 23; i++) { arr.push(i); }
                    return arr;
                })(),
            },
            // Divider
            {
                divider: true,
                content: ':'
            },
            // Minutes
            {
                values: (function () {
                    var arr = [];
                    for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                    return arr;
                })(),
            }
        ]
    });
});

/* ===== Progress Bars ===== */
myApp.onPageInit('progressbar', function (page) {
    $$('.ks-demo-progressbar-inline .button').on('click', function () {
        var progress = $$(this).attr('data-progress');
        var progressbar = $$('.ks-demo-progressbar-inline .progressbar');
        myApp.setProgressbar(progressbar, progress);
    });
    $$('.ks-demo-progressbar-load-hide .button').on('click', function () {
        var container = $$('.ks-demo-progressbar-load-hide p:first-child');
        if (container.children('.progressbar').length) return; //don't run all this if there is a current progressbar loading

        myApp.showProgressbar(container, 0);

        // Simluate Loading Something
        var progress = 0;
        function simulateLoading() {
            setTimeout(function () {
                var progressBefore = progress;
                progress += Math.random() * 20;
                myApp.setProgressbar(container, progress);
                if (progressBefore < 100) {
                    simulateLoading(); //keep "loading"
                }
                else myApp.hideProgressbar(container); //hide
            }, Math.random() * 200 + 200);
        }
        simulateLoading();
    });
    $$('.ks-demo-progressbar-overlay .button').on('click', function () {
        // Add Directly To Body
        var container = $$('body');
        if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading

        myApp.showProgressbar(container, 0);

        // Simluate Loading Something
        var progress = 0;
        function simulateLoading() {
            setTimeout(function () {
                var progressBefore = progress;
                progress += Math.random() * 20;
                myApp.setProgressbar(container, progress);
                if (progressBefore < 100) {
                    simulateLoading(); //keep "loading"
                }
                else myApp.hideProgressbar(container); //hide
            }, Math.random() * 200 + 200);
        }
        simulateLoading();
    });
    $$('.ks-demo-progressbar-infinite-overlay .button').on('click', function () {
        // Add Directly To Body
        var container = $$('body');
        if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
        myApp.showProgressbar(container);
        setTimeout(function () {
            myApp.hideProgressbar();
        }, 3000);
    });
    $$('.ks-demo-progressbar-infinite-multi-overlay .button').on('click', function () {
        var container = $$('body');
        if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
        myApp.showProgressbar(container, 'multi');
        setTimeout(function () {
            myApp.hideProgressbar();
        }, 3000);
    });
});


myApp.onPageInit('list-view', function (page) {
    //alert('test');
    $$('#testget').on('click',function(){
            $$.ajax({
                url: 'http://apihaomai.runger.net/v1/users/logout',
                method: 'GET',
                dataType: 'json',
                data: {
                    api_key: '1121212122323213'
                },
                success: function (data) {
                   alert(data);
                },
                error:function(xhr){
                    //console.log(xhr.response);
                    response=xhr.response;
                    data=JSON.parse(response);
                    alert(data.message);
                }
            });
    });

    $$('#testpost').on('click',function(){
            $$.ajax({
                url: 'http://apihaomai.runger.net/v1/reg/step1',
                method: 'POST',
                dataType: 'json',
                data: {
                    username: '流川枫',
                    userid:'13',
                    truename:'周军',
                    sex:1,
                    birthday:'1980-11-11',
                    idcardNo:'51372119800815178',
                    idcard_front_img_base64:"data:image/png;base64,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tSWATTQ8turSfl1Z5I3pieUzJ2eOH1o8c9JYO7hh6/iW7UPjqwZWXYKZntik3UkLBqyABF6R5Z0rUsAA6vX6wMDAvffee+jQod27d69Zs2Z6evqee+4hoje+8Y0vM8pCRGmavvo8jXMTQi/TeXbO3X///SdOnLj22mt37979cipQFEUcxy925bFjxx555JE0Td/5zneeszu890888cTExMSdd975wlRTAI8//vi51UgvbBlr7cTExJkzZ15okHdH8ptuuumimeGXj4IbzQUiRMzCHJTJex9KYaix9f5LuRLj6GP3P/5XH2sce850MnCwSZSmtbOPfPG+haXa6NjmO9584/v/wdiGVxU2Y2u7DjADAkBhgZAXV6SAiWjz5s1r167dv3//vn37PvOZz2zfvn1ycjKO49tuu+2lA1fdpX+v7Il+0dnm7irCbi/vLgB6scvO6fz06dPHjh274YYbbrvttpf57WfOnKnVaueWMZ9jeXl5//79J0+e3Lhx4y233HK+UW2tveOOO7785S/fd999s7Oz11133QV2765duzZs2HDR6WgieuSRR/r7+6+55poXm516sRXOl40JrZ3lBhQEig151TK4bmAjjtKBkUtW+Wfu+9zv/fB3oTG99fobN2zftmnLtlWbrlLg+N49zzzy5KG9Tzzw6Xvu/dRf/uQffnxk9SuP3rNhBiLAAr5EFIEV3ocrUsDnTNzdu3evXbv2wIEDe/fuNcasWbPm/OU1Lya2o0eP9vX1vZwYVXcJ7urVq9M0PX369HPPPfdibs/y8rKIPPLII915nQvtq7K86qqrzi3HCyEwc6vVOnHiRK1W60aeXqzCrVZrZmZm37599Xr9/LtrNpvHjx8/fvz45ORkd5n0sWPHRCTP83NLjq21zrmiKB577LGFhYWbbrrp/LjAypUrz/eHL+DJJ5/s7++/6NB9ZaBa5q1AyAJFvjQmBkdsjRTS3z8YXyL/qLm8+NH/+GsH902v3xAdOHq440obJfOt5uzcwonDR6dOHF5udVyCL3/myU3/+Te+/1/9GvEr3JdGRQ1AAAgEUAkFyPIVLOAuY2Njw8PDGzZs6GY1f/rTn7766quveZHjzEWk1Wo98cQTL9PW9d7X6/W77rqra7teNPmxuzh248aN3eu7seIL79za89MnNmzYsHXr1oMHD54+ffr8XLELiu3mHud5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"

                },
                success: function (data) {
                   console.log(data);
                }
            });
    });

    $$('#testput').on('click',function(){
            $$.ajax({
                url: 'http://apihaomai.runger.net/v1/mygroup/booking/quickPass',
                method: 'PUT',
                dataType: 'json',
                data: {
                    api_key: '1121212122323213'
                },
                success: function (data) {
                   alert(data);
                }
            });
    });

    $$('#testdelete').on('click',function(){
            $$.ajax({
                url: 'http://apihaomai.runger.net/v1/me/stall/1',
                method: 'DELETE',
                dataType: 'json',
                data: {
                    api_key: '1121212122323213'
                },
                success: function (data) {
                   alert(data);
                }
            });
    });
    
 });

/* ===== Autocomplete ===== */
myApp.onPageInit('autocomplete', function (page) {
    // Fruits data demo array
    var fruits = ('Apple Apricot Avocado Banana Melon Orange Peach Pear Pineapple').split(' ');

    // Simple Dropdown
    var autocompleteDropdownSimple = myApp.autocomplete({
        input: '#autocomplete-dropdown',
        openIn: 'dropdown',
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with input expand
    var autocompleteDropdownExpand = myApp.autocomplete({
        input: '#autocomplete-dropdown-expand',
        openIn: 'dropdown',
        expandInput: true, // expand input
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with all values
    var autocompleteDropdownAll = myApp.autocomplete({
        input: '#autocomplete-dropdown-all',
        openIn: 'dropdown',
        source: function (autocomplete, query, render) {
            var results = [];
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with placeholder
    var autocompleteDropdownPlaceholder = myApp.autocomplete({
        input: '#autocomplete-dropdown-placeholder',
        openIn: 'dropdown',
        dropdownPlaceholderText: 'Try to type "Apple"',
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with ajax data
    var autocompleteDropdownAjax = myApp.autocomplete({
        input: '#autocomplete-dropdown-ajax',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'id', //object's "value" property name
        textProperty: 'name', //object's "text" property name
        limit: 20, //limit to 20 results
        dropdownPlaceholderText: 'Try "JavaScript"',
        expandInput: true, // expand input
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $$.ajax({
                url: 'js/autocomplete-languages.json',
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query
                },
                success: function (data) {
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        }
    });

    // Simple Standalone
    var autocompleteStandaloneSimple = myApp.autocomplete({
        openIn: 'page', //open in page
        opener: $$('#autocomplete-standalone'), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange: function (autocomplete, value) {
            // Add item text value to item-after
            $$('#autocomplete-standalone').find('.item-after').text(value[0]);
            // Add item value to input value
            $$('#autocomplete-standalone').find('input').val(value[0]);
        }
    });

    // Standalone Popup
    var autocompleteStandalonePopup = myApp.autocomplete({
        openIn: 'popup', //open in page
        opener: $$('#autocomplete-standalone-popup'), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange: function (autocomplete, value) {
            // Add item text value to item-after
            $$('#autocomplete-standalone-popup').find('.item-after').text(value[0]);
            // Add item value to input value
            $$('#autocomplete-standalone-popup').find('input').val(value[0]);
        }
    });

    // Multiple Standalone
    var autocompleteStandaloneMultiple = myApp.autocomplete({
        openIn: 'page', //open in page
        opener: $$('#autocomplete-standalone-multiple'), //link that opens autocomplete
        multiple: true, //allow multiple values
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange: function (autocomplete, value) {
            // Add item text value to item-after
            $$('#autocomplete-standalone-multiple').find('.item-after').text(value.join(', '));
            // Add item value to input value
            $$('#autocomplete-standalone-multiple').find('input').val(value.join(', '));
        }
    });

    // Standalone With Ajax
    var autocompleteStandaloneAjax = myApp.autocomplete({
        openIn: 'page', //open in page
        opener: $$('#autocomplete-standalone-ajax'), //link that opens autocomplete
        multiple: true, //allow multiple values
        valueProperty: 'id', //object's "value" property name
        textProperty: 'name', //object's "text" property name
        limit: 50,
        preloader: true, //enable preloader
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $$.ajax({
                url: 'js/autocomplete-languages.json',
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query
                },
                success: function (data) {
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {
            var itemText = [],
                inputValue = [];
            for (var i = 0; i < value.length; i++) {
                itemText.push(value[i].name);
                inputValue.push(value[i].id);
            }
            // Add item text value to item-after
            $$('#autocomplete-standalone-ajax').find('.item-after').text(itemText.join(', '));
            // Add item value to input value
            $$('#autocomplete-standalone-ajax').find('input').val(inputValue.join(', '));
        }
    });
});

/* ===== Change statusbar bg when panel opened/closed ===== */
$$('.panel-left').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-left');
});
$$('.panel-right').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-right');
});
$$('.panel-left, .panel-right').on('close', function () {
    $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
});

/* ===== Generate Content Dynamically ===== */
var dynamicPageIndex = 0;
function createContentPage() {
    mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left sliding"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-content" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or generate <a href="#" class="ks-generate-page">one more page</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
    return;
}
$$(document).on('click', '.ks-generate-page', createContentPage);
