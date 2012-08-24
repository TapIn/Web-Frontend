define([
       'jquery',
       'tapin/frontend/map',
       'tapin/frontend/map/pin',
       'tapin/frontend/map/pincollection',
       'tapin/frontend/sidebar',
       'tapin/frontend/timeslider',
       'tapin/frontend/modal',
       'tapin/frontend/filmstrip',
       'tapin/frontend/volume',
       'tapin/frontend/comments',
       'tapin/frontend/videogallery',
       'tapin/api',
       'tapin/util',
       'tapin/util/storage',
       'tapin/util/event',
       'tapin/util/async',
       'tapin/util/log',
       'tapin/config',
       'tapin/user',
       'phoneformat/phoneformat'],
       function(JQuery, Map, Pin, PinCollection, Sidebar, TimeSlider, Modal, Filmstrip, Volume, Comments, VideoGallery, Api, Util, Storage, Event, Async, Log, Config, User)
{
    return new (function(){
        var _this = this;

        this.mainMap = new Map(JQuery("#map"));
        this.api = null;
        this.timeslider = new TimeSlider(JQuery('#time-slider'));
        this.volume = new Volume(JQuery("#volume"));
        this.sidebar = new Sidebar(JQuery("#sidebar"));
        this.modal = new Modal(JQuery('#modal-page'));
        this.userModal = new Modal(JQuery('#user-modal'));
        this.loader = new Filmstrip(JQuery("#map-loader"), 'assets/img/moving-map-loader.png', [952, 65], [14, 1], 50);
        this.userButton = JQuery('a#dropdown-text');
        this.comments = new Comments(JQuery('#comments'));
        this.api = false;
        this.user = false;
        this.videoGallery = new VideoGallery($('#myCarousel'));

        this.isPlayingFeatured = false;

        this.onLogin = new Event();
        this.onLogout = new Event();
        this.onStreamChange = new Event();
        this.externalLink = true;
        this.videosLoaded = 0
        this.popularVideos = null;

        try {
            this.current_stream_id = window.location.href.split('#video/')[1].split('/')[0];

        }
        catch (e){
            this.current_stream_id = '';
        }

        var timescale = 10*60;
        var showLoaderRef;
        this.updateMap = function()
        {
            if (!_this.mainMap.isInitialized()) {
                return;
            }

            var bounds = _this.mainMap.getBounds();

            var since_time = Math.floor(((new Date()).getTime()/1000) - timescale);

            // Show the loader if the request takes too long
            showLoaderRef = Async.later(1500, function(){
                _this.loader.show();
            });

            //Temp hack, sorry Tyler
            var startTime = null;
            var endTime = null;


            var date = $('#datepicker-invisible').text();

            var currentTime = new Date();
            var timeoffset = currentTime.getTimezoneOffset();

            switch(date) {
                case 'defauflt':
                    startTime=Date.UTC(year,month,day) / 1000 + timeoffset*60 - 21600; //subtract 6 hours as a buffer
                    endTime = startTime + 129600
                    break;
                default:
                    var date1 = date.split('|')[0].split('/')
                    var date2 = date.split('|')[1].split('/')

                    startTime=Date.UTC(date1[2],date1[1],date1[0]) / 1000 + timeoffset*60 -21600 ;
                    endTime=Date.UTC(date2[2],date2[1],date2[0]) / 1000 + timeoffset*60 + 108000;
            }

            // Api.get_streams_by_location(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1], since_time, 'now', function(streams){
            Api.get_streams_by_location(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1], startTime, endTime, function(streams){
                // Don't show the loader/remove the loader when we're done
                clearTimeout(showLoaderRef);
                _this.loader.hide();

                var new_pins = new PinCollection();
                var c = 0;
                for (var i in streams) {
                    var stream = streams[i];
                    if (!_this.isPlayingFeatured && c < 6) {
                        _this.videoGallery.addVideo(i);
                    }
                    var coords = stream[stream.length - 1]['coord'];
                    var pin = new Pin(coords[0], coords[1], i, {stream_id: i, timestamp: stream[stream.length - 1]['timestamp']});
                    new_pins.addOrUpdatePin(pin);
                    c++;
                }
                if (!_this.isPlayingFeatured) {
                    _this.videoGallery.commitUpdate();
                }

                _this.mainMap.Pins.replace(new_pins);
            }, function(err){
                Log('warn', 'Could not update the map', err);
            })
        }

        this.updateNav = function(page)
        {
            return;
            var matchingPage = JQuery('ul.nav li a[href="' + page + '"]');
            if (matchingPage.length > 0) {
                JQuery('ul.nav li').each(function(){
                    $(this).removeClass('active');
                });
                matchingPage.parent().addClass('active');
            }
        }

        this.login = function(username, password, lambda, lambda_error) {
            if (typeof(lambda) === 'undefined') {
                lmabda = function(){};
            }

            if (typeof(lambda_error) === 'undefined') {
                lambda_error = function(){};
            }

            Api.login(username, password, function(data) {
                if ('error' in data) {
                    Log('info', 'Could not log in: ' + data.error);
                    lambda_error(data.error);
                } else {
                    Storage.save('token', data.token);
                    Storage.save('username', username);

                    _this.tokenLogin(username, data.token);
                    lambda();
                    JQuery('#fancybox-close').click();
                    JQuery('#dropdown-text').unbind('click.fb');
                    _this.onLogin.apply();
                }
            });
        }

        this.tokenLogin = function(username, token) {
            // STOP PUTTING STUFF HERE!!!
            mixpanel.identify(username);
            mixpanel.name_tag(username);
            _this.api = new Api(token);
            _this.api.get_object_by_key('user', username, function(userdata) {

                var mpu = userdata;
                mpu['$email'] = userdata['email'];
                mpu['$created'] = userdata['created'];
                mpu['$last_login'] = new Date();
                mixpanel.people.set(mpu);

                userdata.username = username;
                _this.user = new User(userdata);
                _this.onLogin.apply();
            }, true);

        }

        this.logout = function() {
            _this.api = false;
            _this.user = false;
            Storage.erase('token');
            Storage.erase('username');
            _this.onLogout.apply();
        }

        this.showVideo = function(stream_id)
        {
            Log('debug', 'Showing video for pin', stream_id);
            $('#currently-playing').removeClass('hidden');
            $('#player-container').removeClass('hidden');
            $('#controls').removeClass('hidden');
            if (_this.user === false) {
                $('#commentloggedout').removeClass('hidden');
            } else {
                $('#commentbox').removeClass('hidden');
            }
            $('#comments').removeClass('hidden');
            $('#to-remove').addClass('hidden');
            $('#comment-header').removeClass('hidden');
            _this.isPlayingFeatured = false;
            Api.get_stream_by_stream_id(stream_id, function(data){
                _this.comments.updateCommentsFor(stream_id);
                _this.sidebar.player.playStreamData(data);
                current_stream_id = stream_id;
                _this.onStreamChange.apply(stream_id, data);
                // DO NOT PUT ANY CODE HERE!
                // REGISTER IT IN AN ONSTREAMCHANGE EVENT
            }, true);
        }

        var showVideoForPin = function(pin)
        {
            $('#nearbytitle').text('Nearby Streams');
            window.location.hash = 'video/' + pin.Data.stream_id + '/' + pin.Data.timestamp;
        }

        // Used for debugging
        window.onStage = function() {
            Log('info', 'Switching API calls to stage.');
            Config['api']['base'] = 'http://debug.api.tapin.tv/web/';
        }
        window.onProd = function() {
            Log('info', 'Switching API calls to prod.');
            Config['api']['base'] = 'http://api.tapin.tv/web/';
        }


        $.fn.exists = function () {
            return this.length !== 0;
        }

        this.constructor = function(){
            $("a").live('click', function(event){
                var href = $(this).attr('href');
                if (href == '#') {
                    event.stopPropagation();
                    _this.modal.hide();
                    _this.updateNav(href);
                    $(window).trigger('hashchange');
                    return false;
                } else if (typeof(href) === 'string' && href.substring(0,6) === '#page/') {
                    event.stopPropagation();
                    JQuery.ajax({
                        cache: false,
                        url: 'assets/static/' + href.substring(6) + '?nocache=' + (new Date()).getTime(),
                        dataType: 'html',
                        success: function(html){
                            _this.modal.show(html);
                            _this.updateNav(href);
                        }
                    });
                    $(window).trigger('hashchange');

                    return false;
                }
            });

            window['fe'] = _this;

            window['storage'] = Storage;

            // Clippy
            Async.later(500, function(){
                if (typeof(Mousetrap) !== 'undefined') {
                    try {
                        Mousetrap.bind('up up down down left right left right b a enter', function(){
                            var agents = ['Clippy', 'Links', 'Bonzi'];
                            var selected_agent = agents[Math.round(Util.random(0, agents.length - 1))];
                            clippy.BASE_PATH = 'http://static.tapin.tv/agents/'
                            clippy.load(selected_agent, function(agent){
                                agent.show();
                                agent.gestureAt(0,0);
                                agent.speak("You look like you're trying to watch a video. Would you like some help?");
                                Async.every(20000, function(){
                                    agent.animate();
                                });
                                mixpanel.track('easteregg_clippit', {agent: selected_agent});
                            });
                        });
                    } catch (err) {}
                }
            });

            // * * * * * * * * * * * * * * * * * //
            // * *  START VU'S CALENDAR CODE * * //
            // * * * * * * * * * * * * * * * * * //

            var oldLoginHtml = $('#user');
            _this.onLogin.register(function(){
                $("#streams").attr('href', '#stream/' + _this.user.username);
                var html = '<img style="float:left; margin-right: 3px" src="assets/img/avatar-default-' + (_this.user.gender == 'woman'? 'woman' : 'man') + '.png" /> ' + _this.user.getName() + '<b class="caret"></ b>';
                JQuery('a#dropdown-text').html(html);
                JQuery('a#account').attr('href', '#user/' + _this.user.username);
                $('#dropdown-text').attr('data-toggle', 'dropdown');

                // Show upvote and downvote and comment post form
                $('#upvote').removeClass('hidden');
                $('#downvote').removeClass('hidden');
                $('#volume').css('right', '95px');

                // Switch comment box
                if (!_this.isPlayingFeatured) {
                    $('#commentbox').removeClass('hidden');
                    $('#commentloggedout').addClass('hidden');
                }

                // Hide register button
                $('a#register').addClass('hidden');

                // Hide the welcome pintop
                $('#welcome').addClass('hidden');

                $('#commentbox .user-icon').css('background-image', "url('" + _this.user.getAvatar35() + "')");

            });

            _this.onLogout.register(function(){
                JQuery('a#dropdown-text').html('Login').attr('href', 'assets/static/login.html').fancybox();
                $('#dropdown-text').attr('data-toggle', '');
                $('#user').removeClass('open');

                // Hide upvote/downvote and comment post
                $('#upvote').addClass('hidden');
                $('#downvote').addClass('hidden');
                $('#volume').css('right', '35px');

                // Switch comment box
                if (!_this.isPlayingFeatured) {
                    $('#commentbox').addClass('hidden');
                    $('#commentloggedout').removeClass('hidden');
                }

                // Show register button
                $('a#register').removeClass('hidden');

                // Show welcome pintop
                $('#welcome').removeClass('hidden');

                $('.user-icon').css('background-image', "url('assets/img/icon-noavatar-35.png')");
            });

            $('a#signout').click(function(){
                _this.logout();
            });

            $('a#stream').click(function(){
                alert();
            });

            //Comment submission
            $('#comment-form').click(function(){
                $(this).height(60);
            });

            $('#submit-comment').click(function(){
                var comment = $('#comment-form').val();

                _this.api.post_comment_to_streamid(current_stream_id, comment, function(data) {
                    mixpanel.track('commented');
                    Log('info', 'Comment posted!');
                    $("#comment-form").val('');
                    Async.later(250, function(){
                        _this.comments.updateCommentsFor(current_stream_id);
                    });
                });
            });

            $("#welcome a").click(function(){
                mixpanel.track('call_to_action_click');
            });

            // Vu frontend stuff
            $(document).ready(function() {
                $("a#about-page").fancybox();
                $("a#change-password").fancybox();
                $('a#register').fancybox();

                $('#report a').live('click', function(){
                    Api.report_stream(current_stream_id, function(){
                        alert("Thanks, the admins were notified!");
                    });
                });

                if (window.location.hash.substring(1,6) !== 'video') {
                    _this.isPlayingFeatured = true;
                    Api.get_featured_streams(function(data){
                        var videos = Util.shuffle(data);

                        for (var i = 0; i < Util.minimize(videos.length, 6); i++) {
                            _this.videoGallery.addVideo(videos[i][0]);
                        }

                        $('#nearbytitle').text('Featured Streams');

                        _this.videoGallery.commitUpdate();
                    })
                }

                $("#phonenumberform").live('submit', function(event){
                    event.stopPropagation();
                    var phoneNo = formatE164("US", $("#phonenumber").val());
                    if (phoneNo.length !== 12) {
                        alert('Please enter your full phone number. (US only)');
                    } else {
                        phoneNo = phoneNo.substring(1);
                        Api.send_text(phoneNo, function(){
                            mixpanel.track('send_text');
                            $("#phonenumber").val('');
                            $("#fancybox-close").click();
                        }, function(){
                            alert("Couldn't send: double-check your phone number!");
                        });
                    }

                    return false;
                })

                   /* Special date widget */
                    var to = new Date();
                    var from = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 2);

                    $('#datepicker-invisible').text(from.getDate() + '/' + from.getMonth() + '/' + from.getFullYear() + '|' + 
                    to.getDate() + '/' + to.getMonth() + '/' + to.getFullYear());

                    $('#datepicker-calendar').DatePicker({
                      inline: true,
                      date: [from, to],
                      calendars: 3,
                      mode: 'range',
                      current: new Date(to.getFullYear(), to.getMonth() - 1, 1),
                      onChange: function(dates,el) {
                        $('#datepicker-invisible').text(dates[0].getDate() + '/' + dates[0].getMonth() + '/' + dates[0].getFullYear() + '|' + 
                            dates[1].getDate() + '/' + dates[1].getMonth() + '/' + dates[1].getFullYear());

                        // update the range display
                        $('#date-range-field span').text(dates[0].getDate()+' '+dates[0].getMonthName(true)+', '+dates[0].getFullYear()+' - '+
                                                    dates[1].getDate()+' '+dates[1].getMonthName(true)+', '+dates[1].getFullYear());
                      }
                    });

                    var addToPoints = function(amt)
                    {
                        var oldPoints = $('#points').text();
                        oldPoints = oldPoints.substring(0,oldPoints.indexOf(' '));
                        points = parseInt(oldPoints) + amt;
                        $('#points').text(points + ' pt' + (points != 1? 's' : ''));
                    }

                    var resetUpvoteDownvote = function(newStatus)
                    {
                        if (newStatus == -1) {
                            $('#upvote').removeClass('active');
                            $('#downvote').addClass('active');
                        } else if (newStatus == 1) {
                            $('#upvote').addClass('active');
                            $('#downvote').removeClass('active');
                        } else {
                            $('#upvote').removeClass('active');
                            $('#downvote').removeClass('active');
                        }
                    }

                    var getPreviousVote = function()
                    {
                        if ($('#upvote').hasClass('active')) {
                            return 1;
                        } else if ($('#downvote').hasClass('active')) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }

                    function updateVote(currentVote)
                    {
                        addToPoints(-1 * (getPreviousVote() - currentVote));
                    }

                    $('#upvote').bind('click', function(){
                        if ($(this).hasClass('active')) {
                            _this.api.neutralvote_stream(current_stream_id, function(){ resetUpvoteDownvote(0) } );
                            updateVote(0);
                        } else {
                            _this.api.upvote_stream(current_stream_id, function(){ resetUpvoteDownvote(1) } );
                            updateVote(1);
                        }
                    });

                    $('#downvote').bind('click', function(){
                        if ($(this).hasClass('active')) {
                            _this.api.neutralvote_stream(current_stream_id, function(){ resetUpvoteDownvote(0) } );
                            updateVote(0);
                        } else {
                            _this.api.downvote_stream(current_stream_id, function(){ resetUpvoteDownvote(-1) } );
                            updateVote(-1);
                        }
                    });

                    var onDoUpdateUpvoteDownvote = function()
                    {
                        if (typeof(_this.user) !== 'undefined' && _this.user !== false && _this.user !== null && current_stream_id !== '')
                        {
                            _this.api.get_stream_vote(_this.user.username, current_stream_id, resetUpvoteDownvote);
                        }
                    }

                    _this.onLogin.register(onDoUpdateUpvoteDownvote);
                    _this.onStreamChange.register(onDoUpdateUpvoteDownvote);
                    _this.onStreamChange.register(function(stream_id, data){
                        //change video points
                        var points = data.points;
                        if (typeof(points) === 'undefined' || points === null) {
                            points = 0;
                        }

                        $('#video-meta').removeClass('hidden');
                        _this.api.get_object_by_key('user', data.user, function(d){
                            if(d.emailhash){
                                $('#video-meta .user-icon').css('background-image', "url('http://www.gravatar.com/avatar/"+d.emailhash+"?r=pg&s=35&d=http%3A%2F%2Fwww.tapin.tv%2Fassets%2Fimg%2Ficon-noavatar-35.png')");
                            }
                        })
                        $('#video-share').removeClass('hidden');
                        if(data.streamend == 0){
                            $('#video-meta #date').html('Live Streaming');
                        }
                        else {
                            $('#video-meta #date').html('Recorded ' + jQuery.timeago((new Date()).setTime(data.streamend * 1000)));
                        }
                        if(data.user!== '')
                        {
                            var deleteLink = '';
                            if (_this.user && data.user == _this.user.username) {
                                deleteLink = $('<span> - </span>').append($('<a href="#" style="color:red">Delete Video</a>').click(function(){
                                    _this.api.update_object_by_key('stream', current_stream_id, {'delete':true}, function(){
                                        alert("Video has been deleted. Contact support to undo.");
                                        window.location = '/';
                                    });
                                }));
                            }
                            $('#video-meta #user').html($("<span>by <a href='#user/" + data.user +"'>" + data.user + "</a></span>").append(deleteLink));
                        }
                        else {
                            $('#video-meta #user').html("by anonymous");
                        }


                        var connectionCount = data.viewcount;
                        if (typeof(connectionCount) === 'undefined' || connectionCount === null) {
                            connectionCount = 0;
                        }

                        $('#points').text(points + ' pt' + (points != 1? 's' : ''));
                        $('#viewpoints').text(connectionCount + ' view' + (connectionCount != 1? 's' : ''));
                    })

                    // initialize the special date dropdown field
                    $('#date-range-field span').text(from.getDate()+' '+from.getMonthName(true)+', '+from.getFullYear()+' - '+
                                                    to.getDate()+' '+to.getMonthName(true)+', '+to.getFullYear());

                    $('#date-range-field').bind('click', function(){
                      $('#datepicker-calendar').toggle();
                      if($('#date-range-field a').text().charCodeAt(0) == 9660) {
                        // switch to up-arrow
                        $('#date-range-field a').html('&#9650;');
                        $('#date-range-field').css({borderBottomLeftRadius:0, borderBottomRightRadius:0});
                        $('#date-range-field a').css({borderBottomRightRadius:0});
                      } else {
                        // switch to down-arrow
                        $('#date-range-field a').html('&#9660;');
                        $('#date-range-field').css({borderBottomLeftRadius:5, borderBottomRightRadius:5});
                        $('#date-range-field a').css({borderBottomRightRadius:5});
                      }
                      return false;
                    });

                    // Get popular to load
                    Api.get_popular(function(data){
                        _this.popularVideos = data
                        for (var i=0; i<48; i++){
                            $('#sidebar-popular').append('<div class="stream-preview"><a href="#video/' +  
                                _this.popularVideos[i][0] + '/' + _this.popularVideos[i][1]['streamend'] + 
                                '""><img src="http://thumbs.tapin.tv/' + _this.popularVideos[i][0] + 
                                '/144x108/latest.jpg"/ onError="this.src=\' assets/img/default_thumb.png\'"></a></div>')
                        }
                        videosLoaded = 48;
                    })

                    $('#more').click(function(e) {
                        for (var i=videosLoaded; i<videosLoaded+48; i++)
                        {
                            $('#sidebar-popular').append('<div class="stream-preview"><a href="#video/' +  
                                _this.popularVideos[i][0] + '/' + _this.popularVideos[i][1]['streamend'] + 
                                '""><img src="http://thumbs.tapin.tv/' + _this.popularVideos[i][0] + 
                                '/144x108/latest.jpg" onError="this.src=\' assets/img/default_thumb.png\'"/></a></div>')
                        }            
                    });

                    $('.share.fb').live('click', function(event){
                        event.stopPropagation();

                        var url = 'http://www.facebook.com/sharer.php?u=http%3A%2F%2Fs.tapin.tv%2Ft%2f' + current_stream_id;
                        newwindow=window.open(url,'','height=400,width=658');
                        if (window.focus) {newwindow.focus()}
                        return false;
                    });

                    $('.share.twitter').live('click', function(event){
                        event.stopPropagation();

                        var url = 'https://twitter.com/share?text=Check%20out%20this%20stream!&url=http%3A%2F%2Fs.tapin.tv%2Ft%2f' + current_stream_id;
                        newwindow=window.open(url,'','height=260,width=700');
                        if (window.focus) {newwindow.focus()}
                        return false;
                    })

                    $("#popular").live('click', function(event){
                        event.stopPropagation();
                        Log('info', 'Showing popular');
                        Api.get_popular(function(data){
                            _this.userModal.show("{{#each streams}}<div class='stream-preview'><a  href='#video/{{this.0.}}/now' onclick=\"$('#fancybox-close').click()\"><img src='http://thumbs.tapin.tv/{{this.0.}}/144x108/latest.jpg' onError='this.src=\' assets/img/default_thumb.png\''/></a></div>{{/each}}", {'streams':data.slice(0,25)});
                        })
                        return false;
                    })

                    $('#random').live('click', function(event){
                        event.stopPropagation();
                        Log('info', 'Showing a random video');
                        Api.get_random(function(data){
                            console.log(data.streamid);
                            window.location.hash = '#video/' + data.streamid + '/now';
                        });
                        return false;
                    });

                    $('#changepassform').live('submit', function(){
                        if ($('#oldpass').val() && $('#newpass').val() && $('#newpass2').val()) {
                            if ($('#newpass').val() == $('#newpass2').val()) {
                                _this.api.change_password(_this.user.username, $('#oldpass').val(), $('#newpass').val(), function(data){
                                    if (data.error) {
                                        alert(data.error);
                                    } else {
                                        mixpanel.track('password_change');
                                        $('#fancybox-close').click();
                                    }
                                }, function(err){
                                    log('error', 'Api error: ', err);
                                    alert('Api error!');
                                })
                            } else {
                                alert('Make sure your passwords match.');
                            }
                        } else {
                            alert('Please make sure you fill out all fields.')
                        }
                        return false;
                    })

                    $('html').click(function() {
                      if($('#datepicker-calendar').is(":visible")) {
                        $('#datepicker-calendar').hide();
                        $('#date-range-field a').html('&#9660;');
                        $('#date-range-field').css({borderBottomLeftRadius:5, borderBottomRightRadius:5});
                        $('#date-range-field a').css({borderBottomRightRadius:5});
                      }
                    });

                    $('#datepicker-calendar').click(function(event){
                      event.stopPropagation();
                    });
                  /* End special page widget */
                    });

                    $('#loginform').live('submit', function(event) {
                        event.stopPropagation();
                        var ret = window.fe.login($('#loginform #username').val(), $('#loginform #password').val(), function(){
                            mixpanel.track('login');
                            window.fe.modal.hide();
                            $("#loginform #login").prop('disabled', true);
                        }, function(err){
                            alert(err);
                            $("#loginform #login").prop('disabled', false);
                        });
                        $("#loginform #login").prop('disabled', true);
                        return false;
                    });

                    $('#registerform').live('submit', function(event){
                        event.stopPropagation();
                        if($('#registerform #email').val() == '') {
                            alert('Must enter a valid email');
                        } else {
                            $("#registerform #register").prop('disabled', true);
                            Api.register($('#registerform #username').val(), $('#registerform #password').val(), $('#registerform #email').val(), function(data){
                                if (data.error)
                                {
                                    alert(data.error);
                                    $("#registerform #register").prop('disabled', false);
                                } else {
                                    mixpanel.track('register');
                                    Storage.save('token', data.token);
                                    Storage.save('username', $('#registerform #username').val());
                                    _this.tokenLogin($('#registerform #username').val(), data.token);
                                    JQuery('#fancybox-close').click();
                                    JQuery('#dropdown-text').unbind('click.fb');
                                }
                            }, function(err){
                                alert(err);
                                    $("#registerform #register").prop('disabled', false);
                            });}
                        return false;
                    })
            $('#follow-button').live('click', function(event){
                targetUser = $('#username-profile').html();
                _this.api.follow(targetUser, function(){
                    $('#followercount').html(parseInt($('#followercount').html())+1);
                    $('#follow-container').html('<input id="unfollow-button" class="btn" type="button" value="Unfollow" style="position:relative;top: -5px; left: 5px; font-weight: 700" />');
                });
            });

            $('#unfollow-button').live('click', function(event){
                targetUser = $('#username-profile').html();
                _this.api.unfollow(targetUser, function(){
                    $('#followercount').html(parseInt($('#followercount').html())-1);
                    $('#follow-container').html('<input id="follow-button" class="btn btn-primary" type="button" value="Follow" style="position:relative;top: -5px; left: 5px; font-weight: 700" />');
                });
            });

            $('#timepicker').click(function(e){
                switch(e.target.id){
                    case 'date-rangepick':
                        $('#date-range').removeClass('hidden');
                        $('#timepicker a').parent().removeClass('active')
                        $('#date-rangepick').addClass('hidden');
                        break;
                    default:
                        $('#timepicker a').parent().removeClass('active')
                        $('#date-range').addClass('hidden');
                        $('#' + e.target.id).parent().addClass('active');
                        break;
                }
            });
                

            // END Vu frontend stuff

            // Bind to volume change events
            this.volume.onVolumeChange.register(function(newVolume)
            {
                _this.sidebar.player.setVolume(newVolume);
            });

            this.volume.onMute.register(function(){
                _this.sidebar.player.mute();
            });

            this.volume.onUnmute.register(function(volume){
                this.sidebar.player.unMute();
                _this.sidebar.player.setVolume(volume);
            });


            // Bind to time slider events
            this.timeslider.onTimeChange.register(function(new_time){
                timescale = new_time;
                _this.updateMap();
            });

            // Redraw pins on map move
            this.mainMap.onBoundsChange.register(_this.updateMap);

            // Show video when we click a pin
            this.mainMap.onPinClick.register(showVideoForPin);

            mixpanel.track('page_load');

            // Get an initial update
            Async.later(1500, _this.updateMap);

            // Fake live
            Async.every(30 * 1000, _this.updateMap);

            // Do login
            if (Storage.has('username') && Storage.has('token')) {
                _this.tokenLogin(Storage.read('username'), Storage.read('token'));
            } else {
                _this.logout();
            }
        }

        this.constructor();
    });
});