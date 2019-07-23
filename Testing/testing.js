window.onload = function(e){
    console.log("Start");


    var height = 404;
    var width = 647;
    var imagename = "dog-cat.jpg";
    var board = document.getElementById("tb-board")
    boardStyles = `height: ${height}; width: ${width}; margin: 0 auto; background-image: url('${imagename}'); cursor: crosshair;position: relative;`
    board.setAttribute("style",boardStyles);

    var clickCount = 0;
    var coords = [];
    boxes = 0;

    board.addEventListener('click',  function(e) {

        if ( clickCount < 4){
            flag = false;
            var board = document.getElementById("tb-board");
            var top = (e.pageY - parseInt(board.getBoundingClientRect().top));
            var left = (e.pageX - parseInt(board.getBoundingClientRect().left));
            clickCount = clickCount + 1;
            coords.push({x: left, y: top});
        }
        if (clickCount == 4 && flag == false){
            // var baord = document.getElementById("tb-board");
            // board.setAttribute("style","cursor: progress");
            flag = true
            astring = "";
            for ( var i = 0; i< coords.length; i++){
                astring = astring+'['+coords[i].x+','+coords[i].y+']'+'/'
            }
            astring = astring.substring(0, astring.length - 1);
            coords.length = 0;
            param = "http://127.0.0.1:5000/?cords="+astring+"&img=ims/"+imagename;
            console.log(param);
            var xhr = new XMLHttpRequest();
            start = new Date();
            xhr.open('GET', param, true);
            xhr.send();
            boxes = boxes + 1;
            if (boxes == 1){
                var color = "rgb(255,128,128)"
                // pixelArray = tigerPoints;
            }
            if (boxes == 2){
                var color = "rgb(255,255,153)"
                // pixelArray = unclePoints;
            }
            if (boxes == 3){
                var color = "rgb(187, 153, 255)"
                // pixelArray = greenPoints;
            }
            if (boxes == 4){
                var color = "rgb(153, 214, 255)"
            }
            if (boxes == 5){
                var color = "rgb(153, 255, 187)"
            }
            if (boxes == 6){
                var color = "rgb(194, 214, 214)"
            }
            
            // setTimeout( () => {

            // board = document.getElementById("tb-board");
            // for ( var i = 0; i < pixelArray.length; i++){
            //     for ( var j = 0; j < pixelArray[0].length; j++){
            //         if(pixelArray[i][j] == true){
            //             pixelStyle = `height: 1px; width: 1px; top:${i}px; left: ${j}px; background:${color}; position: absolute; opacity: 0.7`;
            //             var pixelBox = document.createElement("div");
            //             pixelBox.setAttribute("style",pixelStyle);
            //             board.appendChild(pixelBox);
            //         }
            //     }
            // }
            // clickCount = 0;
            // }, 2000);
            xhr.onreadystatechange = processRequest;

            var pixelArray
            function processRequest(e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var board = document.getElementById("tb-board");
                    // board.setAttribute("style","cursor: crosshair");
                    end = new Date();
                    response = JSON.parse(xhr.responseText);
                    imageid = response.img;
                    pixelArray = response.points;
                    time = parseFloat(response.time.split(':')[2]);
                    console.log("DEXTR Time:",time);
                    console.log("Request Time:",((end-start)/1000)-time);
                    imageid = imageid.split('/')[1];
                    // console.log(pixelArray);
                    clickCount = 0;
                    for ( var i = 0; i < pixelArray.length; i++){
                        for ( var j = 0; j < pixelArray[0].length; j++){
                            if(pixelArray[i][j] == true){
                                pixelStyle = `height: 1px; width: 1px; top:${i}px; left: ${j}px; background:${color}; position: absolute; opacity: 0.7`;
                                var pixelBox = document.createElement("div");
                                pixelBox.setAttribute("style",pixelStyle);
                                board.appendChild(pixelBox);
                            }
                        }
                    }
                    endtime = new Date()
                    console.log("Loop Time: ",(endtime - end)/1000);
                    console.log("Total Time:",(endtime - start)/1000);
                }  
            }
        }
    });
    
}



