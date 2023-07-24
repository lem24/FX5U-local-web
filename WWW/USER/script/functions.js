//fuctions.js
//FX5U user web page demo by Electrobit OÜ | https://electrobit.ee | IVN-2019

var var_val_arr = [];
var t0, t1;
var refresh_ms;
var all_tags_arr=[];
var total_tags;
var basic_color;
$(document).ready(function()
{
  init();
}); 
//init function
function init()
{
  create_navi_buttons();
  prepare_data();
  if (refresh_ms>0) window.setInterval(function(){prepare_data();}, refresh_ms);
}

//---------Graphics and page elements-----------

function svg_gauge(e,val_raw)
{
  var min_raw=Number(e.dataset.min_raw);
  var max_raw=Number(e.dataset.max_raw);
  var min_eng=Number(e.dataset.min_eng);
  var max_eng=Number(e.dataset.max_eng);
  var min_needle;
  var max_needle;
  var tick_no=Number(e.dataset.tick_no);
  var sub_tick_no=Number(e.dataset.sub_tick_no)+1;
  var line_width=Number(e.dataset.line_width);
  var line_col_width=Number(e.dataset.line_col_width);
  var needle_width=Number(e.dataset.needle_width);
  var tick_font_size=Number(e.dataset.tick_font_size);
  var val_font_size=Number(e.dataset.val_font_size);
  var val_unit=e.dataset.val_unit;
  var round_to=Number(e.dataset.round_to);
  var val_title=e.dataset.val_title;
  var val_green=Number(e.dataset.val_green);
  var val_yellow=Number(e.dataset.val_yellow);
  var val_red=Number(e.dataset.val_red);
  var col_green ='#20960c';
  var col_yellow ='#e2df14';
  var col_red ='#ea1704';
  var font = 'Arial';
  var type=e.dataset.type;
  var w = e.getBoundingClientRect().width;
  var h = e.getBoundingClientRect().height;
  var cex = w/2; // center point
  var cey = h-20-(val_font_size*2); // center point
  var tick_step = 0;
  var tick_step_no = (max_eng-min_eng)/tick_no;
  var ra = Math.min(w/2, h-(val_font_size*2))-tick_font_size*4;
  var val_eng;
  var val_eng_text;
  var val_needle;
  
  e.setAttribute('viewBox',"-"+w/2+" -"+(h-val_font_size*2)+" "+w+" "+h);
  val_eng=change_scale(val_raw, min_raw,max_raw, min_eng, max_eng);
	val_eng_text=roundTo(val_eng, round_to);
  if (type==1)
  {
    min_needle=0;
    max_needle=180;
    val_needle=change_scale(val_eng, min_eng,max_eng, min_needle, max_needle);
    val_green=change_scale(val_green, min_eng,max_eng, min_needle, max_needle);
    val_yellow=change_scale(val_yellow, min_eng,max_eng, min_needle, max_needle);
    val_red=change_scale(val_red, min_eng,max_eng, min_needle, max_needle);
  
  if (!e.contains(e.getElementsByClassName("val_graph")[0]))
  {
    tick_step = 180/tick_no;
    var arc_1 = document.createElementNS('http://www.w3.org/2000/svg','path');
    arc_1.setAttribute("d", describeArc(0, 0, ra, -90, 90));
    arc_1.setAttribute('stroke',basic_color);
    arc_1.setAttribute('stroke-width',line_width);
    arc_1.setAttribute('fill','none');
    e.append(arc_1);
    var arc_green = document.createElementNS('http://www.w3.org/2000/svg','path');
    arc_green.setAttribute("d", describeArc(0, 0, ra-9-needle_width-line_col_width/2, -90,(-90+180*val_green/max_needle)));
    arc_green.setAttribute('stroke',col_green);
    arc_green.setAttribute('stroke-width',line_col_width);
    arc_green.setAttribute('fill','none');
    e.append(arc_green);
    var arc_yellow = document.createElementNS('http://www.w3.org/2000/svg','path');
    arc_yellow.setAttribute("d", describeArc(0, 0, ra-9-needle_width-line_col_width/2, (-90+180*val_green/max_needle),(-90+180*val_yellow/max_needle)));
    arc_yellow.setAttribute('stroke',col_yellow);
    arc_yellow.setAttribute('stroke-width',line_col_width);
    arc_yellow.setAttribute('fill','none');
    e.append(arc_yellow);
    var arc_red = document.createElementNS('http://www.w3.org/2000/svg','path');
    arc_red.setAttribute("d", describeArc(0, 0, ra-9-needle_width-line_col_width/2, (-90+180*val_yellow/max_needle),(-90+180*val_red/max_needle)));
    arc_red.setAttribute('stroke',col_red);
    arc_red.setAttribute('stroke-width',line_col_width);
    arc_red.setAttribute('fill','none');
    e.append(arc_red);

    for (var i=0; i<=tick_no; i++) {
      var new_tick = document.createElementNS('http://www.w3.org/2000/svg','line');
      var new_tick_text = document.createElementNS('http://www.w3.org/2000/svg','text');
      new_tick.setAttribute('x1',-ra);
      new_tick.setAttribute('x2',-ra-10);
      new_tick.setAttribute('y1','0');
      new_tick.setAttribute('y2','0');
      new_tick.style.strokeWidth =line_width;
      new_tick.style.stroke =basic_color;
      new_tick_text.setAttribute('font-family',font);
      new_tick_text.setAttribute('font-size',tick_font_size);
      if ((-ra-20)*Math.cos(i*tick_step*Math.PI / 180) >0) new_tick_text.setAttribute('text-anchor',"start");
      if ((-ra-20)*Math.cos(i*tick_step*Math.PI / 180) <0) new_tick_text.setAttribute('text-anchor',"end");
      if (Math.sin(i*tick_step*Math.PI / 180) ==1) new_tick_text.setAttribute('text-anchor',"middle");
      new_tick_text.setAttribute('x',(-ra-20)*Math.cos(i*tick_step*Math.PI / 180));
      new_tick_text.setAttribute('y',(-ra-20)*Math.sin(i*tick_step*Math.PI / 180));
      new_tick_text.setAttribute('fill',basic_color);
      new_tick_text.setAttribute('fill',basic_color);
      new_tick_text.textContent=min_eng+i*tick_step_no;
      new_tick.setAttribute("transform", "rotate("+(i*tick_step)+")");
      e.appendChild(new_tick);
      e.appendChild(new_tick_text);
       if(i<tick_no)
        {
          for (var ii = 0; ii < sub_tick_no; ii++)
          {
            var new_sub_tick = document.createElementNS('http://www.w3.org/2000/svg','line');
            new_sub_tick.setAttribute('x1',-ra);
            new_sub_tick.setAttribute('x2',-ra-5);
            new_sub_tick.setAttribute('y1','0');
            new_sub_tick.setAttribute('y2','0');
            new_sub_tick.style.strokeWidth =line_width;
            new_sub_tick.style.stroke =basic_color;
            new_sub_tick.setAttribute("transform", "rotate("+((i*tick_step)+(ii*tick_step/sub_tick_no))+")");
            e.appendChild(new_sub_tick);
          }
        }
    }
    var arc_val = document.createElementNS('http://www.w3.org/2000/svg','path');
    arc_val.setAttribute('stroke',basic_color);
    arc_val.setAttribute('stroke-width',needle_width);
    arc_val.setAttribute('fill','none');
    arc_val.setAttribute('class','val_graph');
    e.append(arc_val);
  }
  e.getElementsByClassName("val_graph")[0].setAttribute("d", describeArc(0, 0, ra-5-needle_width/2, -90, (-90+180*val_needle/max_needle)));

  }
  if (type==2)
  {
    min_needle=0;
    max_needle=180;
    val_needle=(((val_eng-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    val_green=(((val_green-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    val_yellow=(((val_yellow-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    val_red=(((val_red-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    
    if (!e.contains(e.getElementsByClassName("val_graph")[0]))
    {
      tick_step = 180/tick_no;
      var circle_1 = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle_1.setAttribute('r','8');
      circle_1.setAttribute('cx','0');
      circle_1.setAttribute('cy','0');
      circle_1.setAttribute('fill',basic_color);
      e.append(circle_1);
      var arc_1 = document.createElementNS('http://www.w3.org/2000/svg','path');
      arc_1.setAttribute("d", describeArc(0, 0, ra, -90, 90));
      arc_1.setAttribute('stroke',basic_color);
      arc_1.setAttribute('stroke-width',line_width);
      arc_1.setAttribute('fill','none');
      e.append(arc_1);
      var arc_green = document.createElementNS('http://www.w3.org/2000/svg','path');
      arc_green.setAttribute("d", describeArc(0, 0, ra+2+line_width+line_col_width/2, -90,(-90+180*val_green/max_needle)));
      arc_green.setAttribute('stroke',col_green);
      arc_green.setAttribute('stroke-width',line_col_width);
      arc_green.setAttribute('fill','none');
      e.append(arc_green);
      var arc_yellow = document.createElementNS('http://www.w3.org/2000/svg','path');
      arc_yellow.setAttribute("d", describeArc(0, 0,  ra+2+line_width+line_col_width/2, (-90+180*val_green/max_needle),(-90+180*val_yellow/max_needle)));
      arc_yellow.setAttribute('stroke',col_yellow);
      arc_yellow.setAttribute('stroke-width',line_col_width);
      arc_yellow.setAttribute('fill','none');
      e.append(arc_yellow);
      var arc_red = document.createElementNS('http://www.w3.org/2000/svg','path');
      arc_red.setAttribute("d", describeArc(0, 0,  ra+2+line_width+line_col_width/2, (-90+180*val_yellow/max_needle),(-90+180*val_red/max_needle)));
      arc_red.setAttribute('stroke',col_red);
      arc_red.setAttribute('stroke-width',line_col_width);
      arc_red.setAttribute('fill','none');
      e.append(arc_red);

      for (var i=0; i<=tick_no; i++) {
        var new_tick = document.createElementNS('http://www.w3.org/2000/svg','line');
        var new_tick_text = document.createElementNS('http://www.w3.org/2000/svg','text');
        new_tick.setAttribute('x1',-ra);
        new_tick.setAttribute('x2',-ra+10);
        new_tick.setAttribute('y1','0');
        new_tick.setAttribute('y2','0');
        new_tick.style.strokeWidth =line_width;
        new_tick.style.stroke =basic_color;
        new_tick_text.setAttribute('font-family',font);
        new_tick_text.setAttribute('font-size',tick_font_size);
        if ((-ra-20)*Math.cos(i*tick_step*Math.PI / 180) >0) new_tick_text.setAttribute('text-anchor',"start");
        if ((-ra-20)*Math.cos(i*tick_step*Math.PI / 180) <0) new_tick_text.setAttribute('text-anchor',"end");
        if (Math.sin(i*tick_step*Math.PI / 180) ==1) new_tick_text.setAttribute('text-anchor',"middle");
        new_tick_text.setAttribute('x',(-ra-line_col_width-line_width-10)*Math.cos(i*tick_step*Math.PI / 180));
        new_tick_text.setAttribute('y',(-ra-line_col_width-line_width-10)*Math.sin(i*tick_step*Math.PI / 180));
        new_tick_text.setAttribute('fill',basic_color);
        new_tick_text.setAttribute('fill',basic_color);
        new_tick_text.textContent=min_eng+i*tick_step_no;
        new_tick.setAttribute("transform", "rotate("+(i*tick_step)+")");
        e.appendChild(new_tick);
        e.appendChild(new_tick_text);
       if(i<tick_no)
        {
          for (var ii = 0; ii < sub_tick_no; ii++)
          {
            var new_sub_tick = document.createElementNS('http://www.w3.org/2000/svg','line');
            new_sub_tick.setAttribute('x1',-ra);
            new_sub_tick.setAttribute('x2',-ra+5);
            new_sub_tick.setAttribute('y1','0');
            new_sub_tick.setAttribute('y2','0');
            new_sub_tick.style.strokeWidth =line_width;
            new_sub_tick.style.stroke =basic_color;
            new_sub_tick.setAttribute("transform", "rotate("+((i*tick_step)+(ii*tick_step/sub_tick_no))+")");
            e.appendChild(new_sub_tick);
          }
        }
       }
     
    var needle = document.createElementNS('http://www.w3.org/2000/svg','line');
     needle.setAttribute('x1',0);
     needle.setAttribute('x2',-ra+13);
     needle.setAttribute('y1','0');
     needle.setAttribute('y2','0');
     needle.style.strokeWidth =needle_width;
     needle.style.stroke =basic_color;
     needle.setAttribute('class','val_graph');
    e.append(needle);
  }
  e.getElementsByClassName("val_graph")[0].setAttribute("transform", "rotate("+(val_needle)+")");
  } 
  if (type==3)
  {
    min_needle=0;
    max_needle=w-40;
    val_needle=(((val_eng-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    val_green=(((val_green-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    val_yellow=(((val_yellow-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    val_red=(((val_red-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    if (!e.contains(e.getElementsByClassName("val_graph")[0]))
    {    
    tick_step = (w-40)/tick_no;
    var frame = document.createElementNS('http://www.w3.org/2000/svg','rect');
    frame.setAttribute('width',max_needle);
    frame.setAttribute('height',needle_width);
    frame.setAttribute('x',-w/2+20);
    frame.setAttribute('y',-line_col_width-2.5*line_width-needle_width);
    frame.setAttribute('stroke-width',line_width);
    frame.setAttribute('stroke',basic_color);
    frame.setAttribute('fill','none');
    e.append(frame);
    var line_1 = document.createElementNS('http://www.w3.org/2000/svg','line');
    line_1.setAttribute('x1',-w/2+20);
    line_1.setAttribute('x2',-w/2+20+max_needle);
    line_1.setAttribute('y1',0-needle_width-5.5*line_width-line_col_width);
    line_1.setAttribute('y2',0-needle_width-5.5*line_width-line_col_width);
    line_1.style.strokeWidth =line_width;
    line_1.style.stroke =basic_color;
    e.appendChild(line_1);
    var col_y=-0.5*line_col_width;
    var line_green = document.createElementNS('http://www.w3.org/2000/svg','line');
    line_green.setAttribute('x1',-w/2+20);
    line_green.setAttribute('x2',-w/2+20+val_green*(w-40)/max_needle);
    line_green.setAttribute('y1',col_y);
    line_green.setAttribute('y2',col_y);
    line_green.style.strokeWidth =line_col_width;
    line_green.style.stroke =col_green;
    e.appendChild(line_green);
    var line_yellow = document.createElementNS('http://www.w3.org/2000/svg','line');
    line_yellow.setAttribute('x1',-w/2+20+val_green*(w-40)/max_needle);
    line_yellow.setAttribute('x2',-w/2+20+val_yellow*(w-40)/max_needle);
    line_yellow.setAttribute('y1',col_y);
    line_yellow.setAttribute('y2',col_y);
    line_yellow.style.strokeWidth =line_col_width;
    line_yellow.style.stroke =col_yellow;
    e.appendChild(line_yellow);
    var line_red = document.createElementNS('http://www.w3.org/2000/svg','line');
    line_red.setAttribute('x1',-w/2+20+val_yellow*(w-40)/max_needle);
    line_red.setAttribute('x2',-w/2+20+val_red*(w-40)/max_needle);
    line_red.setAttribute('y1',col_y);
    line_red.setAttribute('y2',col_y);
    line_red.style.strokeWidth =line_col_width;
    line_red.style.stroke =col_red;
    e.appendChild(line_red);

    for (var i=0; i<=tick_no; i++) 
    {
      var new_tick = document.createElementNS('http://www.w3.org/2000/svg','line');
      var new_tick_text = document.createElementNS('http://www.w3.org/2000/svg','text');
      new_tick.setAttribute('x1',-w/2+20+i*tick_step);
      new_tick.setAttribute('x2',-w/2+20+i*tick_step);
      new_tick.setAttribute('y1',-line_col_width-5*line_width-needle_width);
      new_tick.setAttribute('y2',-line_col_width-5*line_width-needle_width-15);
      new_tick.style.strokeWidth =line_width;
      new_tick.style.stroke =basic_color;
      new_tick_text.setAttribute('font-family',font);
      new_tick_text.setAttribute('font-size',tick_font_size);
      new_tick_text.setAttribute('text-anchor',"middle");
      new_tick_text.setAttribute('x',-w/2+20+i*tick_step);
      new_tick_text.setAttribute('y',0-needle_width-5*line_width-line_col_width-20);
      new_tick_text.setAttribute('fill',basic_color);
      new_tick_text.setAttribute('fill',basic_color);
      new_tick_text.textContent=min_eng+i*tick_step_no;
      e.appendChild(new_tick);
      e.appendChild(new_tick_text);
       if(i<tick_no)
        {
          for (var ii = 0; ii < sub_tick_no; ii++)
          {
            var new_sub_tick = document.createElementNS('http://www.w3.org/2000/svg','line');
            new_sub_tick.setAttribute('x1',-w/2+20+(i*tick_step)+(ii*tick_step/sub_tick_no));
            new_sub_tick.setAttribute('x2',-w/2+20+(i*tick_step)+(ii*tick_step/sub_tick_no));
            new_sub_tick.setAttribute('y1',-line_col_width-5*line_width-needle_width);
            new_sub_tick.setAttribute('y2',-line_col_width-5*line_width-needle_width-10);
            new_sub_tick.style.strokeWidth =line_width;
            new_sub_tick.style.stroke =basic_color;
            e.appendChild(new_sub_tick);
          }
        }

    }
   var val_bar = document.createElementNS('http://www.w3.org/2000/svg','rect');
    val_bar.setAttribute('height',needle_width);
    val_bar.setAttribute('x',-w/2+20);
    val_bar.setAttribute('y',-line_col_width-2.5*line_width-needle_width);
    val_bar.setAttribute('stroke-width','0');
    val_bar.setAttribute('stroke',basic_color);
    val_bar.setAttribute('fill',basic_color);
    val_bar.setAttribute('class','val_graph');
    e.appendChild(val_bar);
  }
  e.getElementsByClassName("val_graph")[0].setAttribute('width',val_needle);
  }
  if (type==4)
  {
    min_needle=0;
    max_needle=h-val_font_size*2-20;
    val_needle=(((val_eng-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    val_green=(((val_green-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    val_yellow=(((val_yellow-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    val_red=(((val_red-min_eng)*(max_needle-min_needle))/(max_eng-min_eng))+min_needle;
    if (!e.contains(e.getElementsByClassName("val_graph")[0]))
    {
      tick_step = max_needle/tick_no;
      var col_x;
      var frame = document.createElementNS('http://www.w3.org/2000/svg','rect');
      frame.setAttribute('width',needle_width);
      frame.setAttribute('height',max_needle);
      frame.setAttribute('x',0);
      frame.setAttribute('y',-max_needle);
      frame.setAttribute('stroke-width',line_width);
      frame.setAttribute('stroke',basic_color);
      frame.setAttribute('fill','none');
      e.append(frame);
      col_x=-line_col_width-5*line_width;
      var line_1 = document.createElementNS('http://www.w3.org/2000/svg','line');
      line_1.setAttribute('x1',col_x);
      line_1.setAttribute('x2',col_x);
      line_1.setAttribute('y1',0);
      line_1.setAttribute('y2',-max_needle);
      line_1.style.strokeWidth =line_width;
      line_1.style.stroke =basic_color;
      e.appendChild(line_1);
      col_x=-0.5*line_col_width-2.5*line_width;
      var line_green = document.createElementNS('http://www.w3.org/2000/svg','line');
      line_green.setAttribute('x1',col_x);
      line_green.setAttribute('x2',col_x);
      line_green.setAttribute('y1',0);
      line_green.setAttribute('y2',-val_green);
      line_green.style.strokeWidth =line_col_width;
      line_green.style.stroke =col_green;
      e.appendChild(line_green);
      var line_yellow = document.createElementNS('http://www.w3.org/2000/svg','line');
      line_yellow.setAttribute('x1',col_x);
      line_yellow.setAttribute('x2',col_x);
      line_yellow.setAttribute('y1',-val_green);
      line_yellow.setAttribute('y2',-val_yellow);
      line_yellow.style.strokeWidth =line_col_width;
      line_yellow.style.stroke =col_yellow;
      e.appendChild(line_yellow);
      var line_red = document.createElementNS('http://www.w3.org/2000/svg','line');
      line_red.setAttribute('x1',col_x);
      line_red.setAttribute('x2',col_x);
      line_red.setAttribute('y1',-val_yellow);
      line_red.setAttribute('y2',-val_red);
      line_red.style.strokeWidth =line_col_width;
      line_red.style.stroke =col_red;
      e.appendChild(line_red);

      col_x=-line_col_width-4.5*line_width;	
      for (var i=0; i<=tick_no; i++) 
      {
        var new_tick = document.createElementNS('http://www.w3.org/2000/svg','line');
        var new_tick_text = document.createElementNS('http://www.w3.org/2000/svg','text');
        new_tick.setAttribute('x1',col_x);
        new_tick.setAttribute('x2',col_x-15);
        new_tick.setAttribute('y1',-max_needle+i*tick_step);
        new_tick.setAttribute('y2',-max_needle+i*tick_step);
        new_tick.style.strokeWidth =line_width;
        new_tick.style.stroke =basic_color;
        new_tick_text.setAttribute('font-family',font);
        new_tick_text.setAttribute('font-size',tick_font_size);
        new_tick_text.setAttribute('text-anchor',"end");
        new_tick_text.setAttribute('x',col_x-22);
        new_tick_text.setAttribute('y',-max_needle+i*tick_step+0.4*tick_font_size);
        new_tick_text.setAttribute('fill',basic_color);
        new_tick_text.setAttribute('fill',basic_color);
        new_tick_text.textContent=max_eng-i*tick_step_no;
        e.appendChild(new_tick);
        e.appendChild(new_tick_text);
        if(i<tick_no)
        {
          for (var ii = 0; ii < sub_tick_no; ii++)
          {
            var new_sub_tick = document.createElementNS('http://www.w3.org/2000/svg','line');
            new_sub_tick.setAttribute('x1',col_x);
            new_sub_tick.setAttribute('x2',col_x-10);
            new_sub_tick.setAttribute('y1',-max_needle+i*tick_step+(ii*tick_step/sub_tick_no));
            new_sub_tick.setAttribute('y2',-max_needle+i*tick_step+(ii*tick_step/sub_tick_no));
            new_sub_tick.style.strokeWidth =line_width;
            new_sub_tick.style.stroke =basic_color;
            e.appendChild(new_sub_tick);
          }
        }
      } 
      var val_bar = document.createElementNS('http://www.w3.org/2000/svg','line');
      val_bar.setAttribute('x1',needle_width/2);
      val_bar.setAttribute('x2',needle_width/2);
      val_bar.setAttribute('y1',0);
      val_bar.style.strokeWidth =needle_width;
      val_bar.style.stroke =basic_color;
      val_bar.setAttribute('class','val_graph');
      e.appendChild(val_bar);
    }
    e.getElementsByClassName("val_graph")[0].setAttribute('y2',-val_needle);
  }
  if (!e.contains(e.getElementsByClassName("val_txt")[0]))
  {   
    var new_val_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
    new_val_text.setAttribute('font-family',font);
    new_val_text.setAttribute('font-size',val_font_size);
    new_val_text.setAttribute('text-anchor',"middle");
    new_val_text.setAttribute('x',0);
    new_val_text.setAttribute('y',1.5*val_font_size);
    new_val_text.setAttribute('fill',basic_color);
    new_val_text.setAttribute('class','val_txt');
    e.appendChild(new_val_text);
  }
  e.getElementsByClassName("val_txt")[0].textContent=val_title+val_eng_text+val_unit;
}
    
  function svg_light(e,val)
  {
      var ra=Number(e.dataset.diam)/2;
      var font_size=Number(e.dataset.font_size);
      var pos=e.dataset.light_pos.toLowerCase();
      var text=e.dataset.text;
      var color=e.dataset.color;
      var line_width=Number(e.dataset.line_width);
      var w = e.getBoundingClientRect().width;
      var h = e.getBoundingClientRect().height;
      var font = 'Arial';
      var i=1, text_pos='';
      
      e.setAttribute('viewBox',"-"+w/2+" -"+(h/2)+" "+w+" "+h);
      if (!val)
      {
        color="#777";
      }
      if (!e.contains(e.getElementsByClassName("light_circle")[0]))
      {
        if (pos=="left")
        {
          text_pos="end"
          i=1;
        }else{
          text_pos="start"
          i=-1;
        }
        var new_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
        new_text.setAttribute('font-family',font);
        new_text.setAttribute('font-size',font_size);
        new_text.setAttribute('text-anchor',text_pos);
        new_text.setAttribute('x',i*(w/2-2*ra-5*line_width-12));
        new_text.setAttribute('y',0.4*font_size);
        new_text.setAttribute('fill',basic_color);
        new_text.textContent=text;
        e.appendChild(new_text);
        var circle_1 = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle_1.setAttribute('r',ra+1.5*line_width);
        circle_1.setAttribute('cx',i*(w/2-ra-3*line_width-5));
        circle_1.setAttribute('cy','0');
        circle_1.style.strokeWidth =line_width;
        circle_1.style.stroke =basic_color;
        circle_1.setAttribute('fill','none');
        e.append(circle_1);
        var light = document.createElementNS('http://www.w3.org/2000/svg','circle');
        light.setAttribute('r',ra);
        light.setAttribute('cx',i*(w/2-ra-3*line_width-5));
        light.setAttribute('cy','0');
        light.setAttribute('class','light_circle');
        light.setAttribute('fill',color);
        e.append(light);
      }
      e.getElementsByClassName("light_circle")[0].setAttribute('fill',color);
  }


  function multitext(e, val)
  {  
    var text_data=e.dataset.text_data.split(';');
    var font_size=Number(e.dataset.font_size);
    var text_pos=e.dataset.text_pos.toLowerCase();
    var label=e.dataset.label;
    var font='Arial';
    var w = e.getBoundingClientRect().width;
    var h = e.getBoundingClientRect().height;
    var i;
    var a=[];
    for (i = 0; i < text_data.length; i++) 
    {
      a[Number(text_data[i].split(':')[0].trim())]=text_data[i].split(':')[1].trim();
    }
    if (!e.contains(e.getElementsByClassName("label_txt_val")[0]))
    {
      if (text_pos=="right")
      {
        i=1;
        text_pos='end';
      }else{
        i=-1;
         text_pos='start';
      }
      e.setAttribute('viewBox',"-"+w/2+" -"+(h/2)+" "+w+" "+h);
      var new_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
      new_text.setAttribute('font-family',font);
      new_text.setAttribute('font-size',font_size);
      new_text.setAttribute('text-anchor',text_pos);
      new_text.setAttribute('x',i*(w/2-10));
      new_text.setAttribute('y',0.4*font_size);
      new_text.setAttribute('fill',basic_color);
      new_text.setAttribute('class','label_txt_val');
      new_text.textContent=label+a[val];
      e.appendChild(new_text);
    }else{
      var new_text =  e.getElementsByClassName("label_txt_val")[0];
       new_text.textContent=label+a[val];
    }
    
  }
  function svg_value(e, val)
  {
    var font_size=Number(e.dataset.font_size);
    var text_pos=e.dataset.text_pos.toLowerCase();
    var label=e.dataset.label;
    var font='Arial';
    var w = e.getBoundingClientRect().width;
    var h = e.getBoundingClientRect().height;
    var min_raw = Number(e.dataset.min_raw);
    var max_raw = Number(e.dataset.max_raw);
    var min_eng = Number(e.dataset.min_eng);
    var max_eng = Number(e.dataset.max_eng);
    var round_to = Number(e.dataset.round_to);
    var unit = e.dataset.val_unit;
    var i;
    
    if (!e.contains(e.getElementsByClassName("label_txt_val")[0]))
    {
      if (text_pos=="right")
      {
        i=1;
        text_pos='end';
      }else{
        i=-1;
         text_pos='start';
      }
      e.setAttribute('viewBox',"-"+w/2+" -"+(h/2)+" "+w+" "+h);
      var new_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
      new_text.setAttribute('font-family',font);
      new_text.setAttribute('font-size',font_size);
      new_text.setAttribute('text-anchor',text_pos);
      new_text.setAttribute('x',i*(w/2-10));
      new_text.setAttribute('y',0.4*font_size);
      new_text.setAttribute('fill',basic_color);
      new_text.setAttribute('class','label_txt_val');
      new_text.textContent=label+change_scale(val, min_raw, max_raw, min_eng, max_eng) +unit;
      e.appendChild(new_text);
    }else{
      var new_text =  e.getElementsByClassName("label_txt_val")[0];
      new_text.textContent=label+change_scale(val, min_raw, max_raw, min_eng, max_eng) +unit;
    }
  
  }
  
  function svg_value_input(e, val)
  {
    var font_size=Number(e.dataset.font_size);
    var text_pos=e.dataset.text_pos.toLowerCase();
    var label=e.dataset.label;
    var font='Arial';
    var w = e.getBoundingClientRect().width;
    var h = e.getBoundingClientRect().height;
    var min_raw = Number(e.dataset.min_raw);
    var max_raw = Number(e.dataset.max_raw);
    var min_eng = Number(e.dataset.min_eng);
    var max_eng = Number(e.dataset.max_eng);
    var round_to = Number(e.dataset.round_to);
    var tag = e.dataset.tag;
    var unit = e.dataset.val_unit;
    var i=0, label_width, val_width, unit_width, x0;
    
    if (!e.contains(e.getElementsByClassName("label_txt_val")[0]))
    {
      if (text_pos=="right") i=1;
      
      e.setAttribute('viewBox',"0 -"+(h/2)+" "+w+" "+h);
      var frame = document.createElementNS('http://www.w3.org/2000/svg','rect');
      frame.setAttribute('height',1.2*font_size);
      frame.setAttribute('y',-1.1*font_size/2);
      frame.setAttribute('stroke-width',1);
      frame.setAttribute('stroke',basic_color);
      frame.setAttribute('fill','#eee');
      e.append(frame);
      frame.onclick = function() {input_val(label, tag, min_raw, max_raw, min_eng, max_eng, unit);}
      
      var label_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
      label_text.setAttribute('font-family',font);
      label_text.setAttribute('font-size',font_size);
      label_text.setAttribute('text-anchor','start');
      label_text.setAttribute('x',0);
      label_text.setAttribute('y',0.4*font_size);
      label_text.setAttribute('fill',basic_color);
      label_text.textContent=label;
      e.appendChild(label_text);
      label_width = label_text.getBBox().width;
      var val_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
      val_text.setAttribute('font-family',font);
      val_text.setAttribute('font-size',font_size);
      val_text.setAttribute('text-anchor','end');
      val_text.setAttribute('x',0);
      val_text.setAttribute('y',0.4*font_size);
      val_text.setAttribute('class','label_txt_val');
      val_text.setAttribute('fill',basic_color);
      val_text.textContent= max_eng;
      e.appendChild(val_text);
      val_text.onclick = function() {input_val(label, tag, min_raw, max_raw, min_eng, max_eng, unit);}
      val_width = val_text.getBBox().width;
      val_text.textContent= change_scale(val, min_raw, max_raw, min_eng, max_eng);
      var unit_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
      unit_text.setAttribute('font-family',font);
      unit_text.setAttribute('font-size',font_size);
      unit_text.setAttribute('text-anchor','start');
      unit_text.setAttribute('x',0);
      unit_text.setAttribute('y',0.4*font_size);
      unit_text.setAttribute('fill',basic_color);
      unit_text.textContent=unit;
      e.appendChild(unit_text);
      unit_width = unit_text.getBBox().width;
      x0=i*(w-(label_width+1.4*val_width+unit_width));
      label_text.setAttribute('x',x0);
      val_text.setAttribute('x',(x0 + label_width+1.2*val_width));
      unit_text.setAttribute('x',(x0+label_width+1.4*val_width));
      frame.setAttribute('width',1.2*val_width);
      frame.setAttribute('x',x0+label_width+0.1*val_width);
      
      
    }else{
      var new_text =  e.getElementsByClassName("label_txt_val")[0];
      new_text.textContent=change_scale(val, min_raw, max_raw, min_eng, max_eng);
    }
  
  }
  
  function input_val(label, tag, min_raw, max_raw, min_eng, max_eng, unit)
  {
    var new_val = 0;
    new_val=prompt("Please enter new value for:\n"+label + "["+ unit +"]\nMin: "+ min_eng+ "; Max: "+max_eng);
    if (new_val<=max_eng && new_val>=min_eng && !isNaN(parseFloat(new_val)) && isFinite(new_val)) 
    {
      new_val=change_scale(new_val, min_eng,max_eng, min_raw, max_raw);
      send_data(tag, new_val);
      
    }else{
      alert("Value not in range.");
      return false;
    }  
    
  }
  
  function button_input(e, val)
  {
    var font = 'Arial';
    var w = e.getBoundingClientRect().width;
    var h = e.getBoundingClientRect().height;
    var font_size=Number(e.dataset.font_size);
    var label_color=e.dataset.label_color;
    var type=e.dataset.type;
    var label=[], color=[];
    var tag = e.dataset.tag;
    label[1]=e.dataset.label_on;
    label[0]=e.dataset.label_off;
    color[1]=e.dataset.color_on;
    color[0]=e.dataset.color_off;
    var r=h/8;
    if (!e.contains(e.getElementsByClassName("button_body")[0]))
    {
      var button_body = document.createElementNS('http://www.w3.org/2000/svg','path');
      button_body.setAttribute("d", round_corner_box_d(5, 5, w-10, h-10, r));
      button_body.setAttribute('stroke',basic_color);
      button_body.setAttribute('stroke-width',1);
      button_body.setAttribute('class','button_body');
      button_body.setAttribute('style','cursor:pointer;');
      
      e.append(button_body);
      var button_label = document.createElementNS('http://www.w3.org/2000/svg','text');  
      button_label.setAttribute('x',w/2);
      button_label.setAttribute('y',h/2+0.35*font_size);
      button_label.style.strokeWidth =0;
      button_label.setAttribute('font-size',font_size);
      button_label.setAttribute('font-family',font);
      button_label.setAttribute('text-anchor','middle');
      button_label.setAttribute('fill',label_color);
      button_label.setAttribute('class','button_label');
      button_label.setAttribute('style','cursor:pointer;');
      e.appendChild(button_label);
      
    }
    var button_body =  e.getElementsByClassName("button_body")[0];
    var button_label =  e.getElementsByClassName("button_label")[0];
    button_body.setAttribute('fill',color[val]);
    button_label.textContent=label[val];
    button_body.onclick = function() {button_input_onclik(tag, val, type);}
    button_label.onclick = function() {button_input_onclik(tag, val, type);}
  }  
  
  function button_input_onclik(tag, val, type)
  {
    var new_val = 0;
    if (type=='toggle')
    {
      if (val==0) new_val=1;
      if (val==1) new_val=0;
    }
    if (type=='set') new_val=1;
    if (type=='reset') new_val=0;
    send_data(tag, new_val);  
  }
  
  function navi_button(e)
  {
    var font = 'Arial';
    var w = e.getBoundingClientRect().width;
    var h = e.getBoundingClientRect().height;
    var font_size=Number(e.dataset.font_size);
    var label_color=e.dataset.label_color;
    var url=e.dataset.url;
    var label=e.dataset.label;
    var color=e.dataset.color;
    var r=h/8;
    var button_body = document.createElementNS('http://www.w3.org/2000/svg','path');
    button_body.setAttribute("d", round_corner_box_d(5, 5, w-10, h-10, r));
    button_body.setAttribute('stroke',basic_color);
    button_body.setAttribute('stroke-width',1);
    button_body.setAttribute('style','cursor:pointer;');
    button_body.setAttribute('fill',color);
    e.append(button_body);
    var button_label = document.createElementNS('http://www.w3.org/2000/svg','text');  
    button_label.setAttribute('x',w/2);
    button_label.setAttribute('y',h/2+0.35*font_size);
    button_label.style.strokeWidth =0;
    button_label.setAttribute('font-size',font_size);
    button_label.setAttribute('font-family',font);
    button_label.setAttribute('text-anchor','middle');
    button_label.setAttribute('fill',label_color);
    button_label.setAttribute('style','cursor:pointer;');
    button_label.textContent=label;
    e.appendChild(button_label);
    button_body.onclick = function() {window.location.href = url;}
    button_label.onclick = function() {window.location.href = url;}
  }
  
  function svg_chart(e, val_raw_arr)
  {
    //var e=document.getElementsByClassName("svg_chart")[0];
    //var val_raw_arr=[];
    var pen_arr=[];
    var rec;
    var pen_arr_prop_name;
    var pen_no, pen_start_tag_no;
    var w = e.getBoundingClientRect().width;
    var h = e.getBoundingClientRect().height;
    var font = 'Arial';
    var tick_font_size=Number(e.dataset.tick_font_size);
    var pen_font_size=Number(e.dataset.pen_font_size);
    var title_font_size=Number(e.dataset.title_font_size);
    var title = e.dataset.title;
    var pen_width=Number(e.dataset.pen_width);
    var x_tick_no=Number(e.dataset.x_tick_no);
    var x_tick_min=Number(e.dataset.x_tick_min);
    var x_tick_max=Number(e.dataset.x_tick_max);
    var pen_x1,pen_x2, pen_y1,pen_y2, pen_max, pen_min, pen_data_len, color='', btn_x, btn_y, btn_r, selected_pen, pen_sum=0;
    var new_tick, group, text_box, pen_buton;

    e.setAttribute('viewBox',"-"+0+" -"+h+" "+w+" "+h);
    e.setAttribute('font-family',font);
    //for (var i=0; i<=99; i++)
    //{
    //  val_raw_arr[1][i]=i*2;
    //  val_raw_arr[2][i]=-i;
    //}
    
    for (rec in e.dataset) 
    {
      if (rec.split('_')[0]=='pen' && $.isNumeric(rec.split('_')[1])) 
      {
        pen_no = rec.split('_')[1];
        if (!Array.isArray(pen_arr[pen_no])) 
        {
          pen_arr[pen_no]=[];
          pen_arr[pen_no]['data']=[];
        }  
        pen_arr_prop_name = rec.replace(rec.split('_')[0]+'_'+pen_no+'_', ""); 
        pen_arr[pen_no][pen_arr_prop_name]=e.dataset[rec];
      }
    }
    
    for (pen_no in pen_arr) 
    {
      pen_start_tag_no=Number(pen_arr[pen_no]['start_tag'].toUpperCase().replace('WD', ""));
      for (var i=0; i<=99; i++)
      {
        pen_arr[pen_no]['data'][i] = val_raw_arr['WD'+(pen_start_tag_no+i)];
      }
    }
    var frame_size_x=w-200;
    var frame_size_y=h-40-2.5*title_font_size;
    var frame_x0=45;
    var frame_y0=-h+2.5*title_font_size+frame_size_y;
    
   
    if (!e.contains(e.getElementsByClassName("chart_frame")[0]))
    {
      var new_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
      new_text.setAttribute('x',10);
      new_text.setAttribute('y',-h+1.5*title_font_size);
      new_text.style.strokeWidth =0;
      new_text.setAttribute('font-size',title_font_size);
      new_text.setAttribute('font-family',font);
      new_text.setAttribute('text-anchor','start');
      new_text.setAttribute('fill',basic_color);
      new_text.textContent=title;
      e.appendChild(new_text);
      
      for (var i=0; i<=x_tick_no+1; i++) 
      {
        new_tick = document.createElementNS('http://www.w3.org/2000/svg','line');
        new_tick.setAttribute('x1',frame_x0+i*frame_size_x/(x_tick_no+1));
        new_tick.setAttribute('x2',frame_x0+i*frame_size_x/(x_tick_no+1));
        new_tick.setAttribute('y1',frame_y0);
        new_tick.setAttribute('y2',frame_y0-frame_size_y);
        new_tick.style.strokeWidth =1;
        new_tick.style.stroke ='#eee';
        e.appendChild(new_tick);
        text_box = document.createElementNS('http://www.w3.org/2000/svg','text');  
        text_box.setAttribute('font-size',tick_font_size);
        text_box.setAttribute('font-family',font);
        text_box.setAttribute('text-anchor','middle');
        text_box.setAttribute('x',frame_x0+i*frame_size_x/(x_tick_no+1));
        text_box.setAttribute('y',frame_y0+1.5*tick_font_size);
        text_box.setAttribute('fill',basic_color);
        text_box.textContent=roundTo(x_tick_min+(x_tick_max-x_tick_min)*i/(x_tick_no+1),2);
        e.appendChild(text_box);
      }
      
     // console.log(h+'|'+frame_size_y+'|'+frame_y0);
      for (pen_no in pen_arr) 
      {
        
        group = document.createElementNS('http://www.w3.org/2000/svg','g');
        group.style.strokeWidth =1;
        group.setAttribute('class','pen_'+pen_no);
        group.style.stroke =pen_arr[pen_no]['col'];
        e.appendChild(group);
        
        group = document.createElementNS('http://www.w3.org/2000/svg','g');
        group.style.strokeWidth =1;
        group.setAttribute('class','pen_tick');
        group.setAttribute('font-size',tick_font_size);
        group.setAttribute('font-family',font);
        group.setAttribute('text-anchor','end');
        group.style.stroke =basic_color;
        e.appendChild(group);
        if (pen_no>1) group.setAttribute('display','none');
        for (var i=0; i<=pen_arr[pen_no]['tick_no']; i++)
        {
          line = document.createElementNS('http://www.w3.org/2000/svg','line');
          line.setAttribute('x1',frame_x0);
          line.setAttribute('x2',frame_x0+frame_size_x);
          line.setAttribute('y1',-i*frame_size_y/(pen_arr[pen_no]['tick_no'])+frame_y0);
          line.setAttribute('y2',-i*frame_size_y/(pen_arr[pen_no]['tick_no'])+frame_y0);
          line.style.stroke ='#eee';
          group.appendChild(line);
          text_box = document.createElementNS('http://www.w3.org/2000/svg','text');  
          text_box.setAttribute('x',frame_x0-10);
          text_box.style.strokeWidth =0;
          text_box.setAttribute('fill',basic_color);
          text_box.setAttribute('y',-i*frame_size_y/(pen_arr[pen_no]['tick_no'])+frame_y0+0.4*tick_font_size);
          text_box.textContent=roundTo(change_scale(i, 0,pen_arr[pen_no]['tick_no'], pen_arr[pen_no]['min_eng'], pen_arr[pen_no]['max_eng']), pen_arr[pen_no]['round_to']);
          group.appendChild(text_box);
          
        }
        if (color=='')
        {
          color=pen_arr[pen_no]['col'];
        }else{
          color="#a7a7a7";
        }
        group = document.createElementNS('http://www.w3.org/2000/svg','g');
        group.style.strokeWidth =1;
        group.setAttribute('font-size',pen_font_size);
        group.setAttribute('text-anchor','start');
        group.setAttribute('font-family',font);
        group.setAttribute('class','pen_selector_'+pen_no);
        group.setAttribute('data-pen_col',pen_arr[pen_no]['col']);
        group.style.stroke =basic_color;
        e.appendChild(group);
        btn_r= pen_font_size/2+4;
        btn_x= frame_x0+frame_size_x+btn_r+10;
        btn_y= pen_font_size+frame_y0-frame_size_y+(pen_no-1)*(2*btn_r+5);
        
        var new_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
        new_text.setAttribute('x',btn_x+btn_r*2+10);
        new_text.setAttribute('y',btn_y+pen_font_size*0.4);
        new_text.style.strokeWidth =0;
        new_text.setAttribute('fill',basic_color);
        new_text.textContent=pen_arr[pen_no]['pen_title'];
        group.appendChild(new_text);
        var circle_1 = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle_1.setAttribute('r',btn_r);
        circle_1.setAttribute('cx',btn_x);
        circle_1.setAttribute('cy',btn_y);
        circle_1.setAttribute('fill','none');
        group.append(circle_1);
        var light = document.createElementNS('http://www.w3.org/2000/svg','circle');
        light.setAttribute('r',btn_r-4);
        light.setAttribute('cx',btn_x);
        light.setAttribute('cy',btn_y);
        light.setAttribute('class','pen_buton');
        light.setAttribute('fill',color);
        group.append(light);
        group.onclick = function() {show_pen_data(this); }
      }
      group = document.createElementNS('http://www.w3.org/2000/svg','g');
      group.style.strokeWidth =0;
      group.setAttribute('font-size',pen_font_size);
      group.setAttribute('text-anchor','start');
      group.setAttribute('font-family',font);
      group.setAttribute('fill',basic_color);
      e.appendChild(group);
      btn_x= frame_x0+frame_size_x+10;
      btn_y= btn_y+2*btn_r+20;
      var new_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
      new_text.setAttribute('x',btn_x);
      new_text.setAttribute('y',btn_y);
      new_text.setAttribute('class','pen_data_val');
      group.appendChild(new_text);
      var new_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
      new_text.setAttribute('x',btn_x);
      new_text.setAttribute('y',btn_y +(1.5*pen_font_size));
      new_text.setAttribute('class','pen_data_min');
      group.appendChild(new_text);
      var new_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
      new_text.setAttribute('x',btn_x);
      new_text.setAttribute('y',btn_y +(3*pen_font_size));
      new_text.setAttribute('class','pen_data_max');
      group.appendChild(new_text);
      var new_text = document.createElementNS('http://www.w3.org/2000/svg','text');  
      new_text.setAttribute('x',btn_x);
      new_text.setAttribute('y',btn_y +(4.5*pen_font_size));
      new_text.setAttribute('class','pen_data_avg');
      group.appendChild(new_text);
      
      var frame = document.createElementNS('http://www.w3.org/2000/svg','rect');
      frame.setAttribute('width',frame_size_x);
      frame.setAttribute('height',frame_size_y);
      frame.setAttribute('x',frame_x0);
      frame.setAttribute('y',frame_y0-frame_size_y);
      frame.setAttribute('stroke-width',1);
      frame.setAttribute('stroke',basic_color);
      frame.setAttribute('class','chart_frame');
      frame.setAttribute('fill','none');
      e.append(frame);
    }
    
    var pen_buttons = e.getElementsByClassName('pen_buton');
    for (var i=0; i < pen_buttons.length; i++) {
      if (pen_buttons[i].getAttribute('fill') !="#a7a7a7") selected_pen = (i+1);
    }
    for( var i = 0; i < pen_arr[selected_pen]['data'].length; i++ ){
      pen_sum += pen_arr[selected_pen]['data'][i]; 
    }

    e.getElementsByClassName("pen_data_val")[0].textContent='Val: '+pen_arr[selected_pen]['data'][0] + pen_arr[selected_pen]['unit'];
    e.getElementsByClassName("pen_data_min")[0].textContent='Min: '+ Math.min(...pen_arr[selected_pen]['data']) + pen_arr[selected_pen]['unit'];
    e.getElementsByClassName("pen_data_max")[0].textContent='Max: '+ Math.max(...pen_arr[selected_pen]['data']) + pen_arr[selected_pen]['unit'];
    e.getElementsByClassName("pen_data_avg")[0].textContent='Avg: '+ roundTo(pen_sum/pen_arr[selected_pen]['data'].length, pen_arr[selected_pen]['round_to']) + pen_arr[selected_pen]['unit'];
        
    for (pen_no in pen_arr) 
    {
      pen_data_len=pen_arr[pen_no]['data'].length;
      pen_max= pen_arr[pen_no]['max_raw'];
      pen_min= pen_arr[pen_no]['min_raw'];
      group=e.getElementsByClassName('pen_'+pen_no)[0];
      if (group) group.remove();
      group = document.createElementNS('http://www.w3.org/2000/svg','g');
      group.style.strokeWidth =pen_width;
      group.setAttribute('class','pen_'+pen_no);
      group.style.stroke =pen_arr[pen_no]['col'];
      e.appendChild(group);
      for (var i=0; i<=pen_data_len-2; i++)
      {
        pen_x1=frame_x0+frame_size_x-(i*frame_size_x/(pen_data_len-1));
        pen_x2=frame_x0+frame_size_x-((i+1)*frame_size_x/(pen_data_len-1));
        pen_y1=change_scale(pen_arr[pen_no]['data'][i], pen_min,pen_max, 0, frame_size_y);
        pen_y2=change_scale(pen_arr[pen_no]['data'][i+1], pen_min,pen_max, 0, frame_size_y);
        line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1',pen_x1);
        line.setAttribute('x2',pen_x2);
        line.setAttribute('y1',frame_y0-pen_y1);
        line.setAttribute('y2',frame_y0-pen_y2);
        group.appendChild(line);
      }
    }
}

function show_pen_data(e2)
{
	var e=e2.parentElement.getElementsByClassName("pen_tick");
  var pen_no=e2.getAttribute('class').split('_')[2];
  var pen_buttons = e2.parentElement.getElementsByClassName('pen_buton');
  var color= e2.dataset.pen_col;

  $(e).hide();
  $(e[pen_no-1]).show();
  for (var i=0; i < pen_buttons.length; i++) {
      pen_buttons[i].setAttribute('fill','#a7a7a7');
  }
  
  e2.getElementsByClassName('pen_buton')[0].setAttribute('fill',color);
  
  
}
function roundTo(val, no)
{
  return Math.round(val * Math.pow(10,no)) / Math.pow(10,no);
}

function change_scale(val, min_1,max_1, min_2, max_2)
{
	return (((Number(val)-min_1)*(max_2-min_2))/(max_1-min_1))+Number(min_2);
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
}

function round_corner_box_d(x, y, w, h, r)
{
	var d;
  w=w-2*r;
  h=h-2*r;
  x=x+r;
  d='M'+x+','+y+' h'+w+' a'+r+','+r+' 0 0 1 '+r+','+r+' v'+h+' a'+r+','+r+' 0 0 1 -'+r+','+r+' h-'+w+' a'+r+','+r+' 0 0 1 -'+r+',-'+r+' v-'+h+' a'+r+','+r+' 0 0 1 '+r+',-'+r+' z';
	return d;
}
function create_navi_buttons()
{
  navi_arr = document.getElementsByClassName("svg_button_navi");
  for (var i in navi_arr) if (navi_arr.hasOwnProperty(i))
  {
    navi_button(navi_arr[i]);
  }

}
//
//---------Data read/write-----------

// The functions for a CGI request
function prepare_data()
{
  t0 = performance.now();

  var data_arr = document.querySelectorAll('[data-tag]');
  var tag, pen_start_tag, tag_type, tag_addr, tag_no, tag_count=0, pen_no;
  // creating request parameter string
  for (var i in data_arr) if (data_arr.hasOwnProperty(i)) 
  {
    tag = data_arr[i].getAttribute('data-tag').split('.')[0].toUpperCase();
    if (all_tags_arr.indexOf(tag) == -1) all_tags_arr.push(tag);
  }
  data_arr = document.getElementsByClassName("svg_chart");
  for (var i in data_arr) if (data_arr.hasOwnProperty(i))
  {
    for (pen_no = 1; pen_no < 5; pen_no++)
    {
      if(data_arr[i].hasAttribute('data-pen_'+pen_no+'_start_tag'))
      {
        pen_start_tag = data_arr[i].getAttribute('data-pen_'+pen_no+'_start_tag').toUpperCase().replace('WD', ""); ;
        tag_no = data_arr[i].getAttribute('data-pen_'+pen_no+'_tag_no');
        for (var ii=0; ii < tag_no; ii++)
        {
          tag = 'WD'+(Number(pen_start_tag)+Number(ii));
          if (all_tags_arr.indexOf(tag) == -1) all_tags_arr.push(tag);
        }
      }
    }
  }
  total_tags=all_tags_arr.length;
  if (total_tags>0) get_data(all_tags_arr);
 } //   
 
 function get_data(tags_arr)
 {
  var i=0, param='';
  var number_tags_in_request=32;
  var request_tags_arr=[];
  for (i = 0; i < Math.min(number_tags_in_request, tags_arr.length); i++) 
  {
    tag_type = tags_arr[i].charAt(0);
    tag_addr = tags_arr[i].substr(1);
    request_tags_arr.push(tags_arr[i]);
    param +='DEV'+ i.toString(16)+'='+tag_addr+'&TYP'+i.toString(16)+'='+tag_type+'&' ;
  }
  
  param = "NUM=" + i.toString(16) + '&'+param;  
  param = param.slice(0, -1);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "/cgi/RdDevRnd.cgi", true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var FUNC = function() {fill_data_arr(xhr, request_tags_arr, tags_arr); }; // Response analysis function setting
  xhr.onreadystatechange = FUNC;
  xhr.send(param);
  param='';
  
   // console.log(param); 
}

function send_data(tag, val)
 {
  var i=0, param='';
  tag_type = tag.charAt(0).toUpperCase();
  tag_addr = tag.substr(1);
  
  param ='DEV1='+tag_addr+'&TYP1='+tag_type+'&DATA1='+val.toString(16) ;
  param = 'NUM=1&'+param;  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "/cgi/WrDev.cgi", true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var FUNC = function() {send_response(xhr)}; 
  xhr.onreadystatechange = FUNC;
  xhr.send(param);
  param='';
  
   // console.log(param); 
}
function send_response(xhr) {
  // XMLHttpRequest Client status check
  // 0:UNSENT 1:OPENED 2:HEADERS_RECEIVED 3:LOADING 4:DONE
  if( 4 != xhr.readyState ) {
  // End the processing if the status 4 is other than DONE (operation complete).
  return;
  }
  // HTTP Response code check
  if ( 200 != xhr.status ) {
  // Display the error dialog box if the response code is other than "200 OK".
  alert("HTTP STATUS ERROR (data send)=" + xhr.status );
  return;
  }
  var value;
  var res = JSON.parse( xhr.response ); // Analysis processing of JSON string
  // Judgment from the CGI
  if( res.RET != "0000" ) {
  // Display the error dialog box if the result is abnormal.
  alert("ERROR (data send)=" + res.RET);
  }
  
}

  
function fill_data_arr(xhr, request_tags_arr, tags_arr)
{
  
  if( 4 != xhr.readyState ) {
  // End the processing if the status 4 is other than DONE (operation complete).
  return;
  }
  // HTTP Response code check
  if ( 200 != xhr.status ) {
  // Display the error dialog box if the response code is other than "200 OK".
  alert("HTTP STATUS ERROR=" + xhr.status );
  return;
  }
  
  var res = JSON.parse( xhr.response ); // Analysis processing of JSON string
  // Judgment from the CGI
  if( res.RET == "0001" ) {
    alert("Not logged in (Err.code: " + res.RET+")");
    window.location.replace(window.location.origin);
  }
  if( res.RET != "0000" ) {
  // Display the error dialog box if the result is abnormal.
  alert("ERROR=" + res.RET);
  }
  else {
  var index;
    for(var i=0;i<res.DATA.length;i++)
    { 
      var_val_arr[request_tags_arr[i]]=parseInt(res.DATA[i], 16);
      index = tags_arr.indexOf(request_tags_arr[i]);
      tags_arr.shift();     
    }
    if (tags_arr.length>0)
    {
      get_data(tags_arr);
        
    }else{
      
      t1 = performance.now();
      document.getElementById("scan_stats").innerHTML="Tags no: "+total_tags +"; Data transfer time:"+ roundTo((t1 - t0), 1) + " ms." ;
      if (update_data()=="done" && refresh_ms==0)
      {
        prepare_data();
     //  get_data(all_tags_arr);
      }
      //console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
      
    } ;
    /*
    
    */
  }
}
function update_data()
{
  var tag; 
  var val_bit;
  var a = document.querySelectorAll('[data-tag]');
  var val_bit_no;
 
  for (var i in a) if (a.hasOwnProperty(i)) 
  {
    tag = a[i].getAttribute('data-tag').split('.')[0].toUpperCase();
    val=var_val_arr[tag];
    val_bit_no=a[i].getAttribute('data-tag').split('.')[1];
    val_bit =(val >> (val_bit_no)) & 1;
    if (a[i].getAttribute("class")=="svg_gauge") svg_gauge(a[i], val);     
    if (a[i].getAttribute("class")=="svg_light") svg_light(a[i], val_bit);
    if (a[i].getAttribute("class")=="multitext") multitext(a[i], Math.floor(val/10));
    if (a[i].getAttribute("class")=="svg_value") svg_value(a[i], val);
    if (a[i].getAttribute("class")=="svg_value_input") svg_value_input(a[i], val);
    if (a[i].getAttribute("class")=="svg_button_input") button_input(a[i], val);
    //a[i].innerHTML = parseInt(res.DATA[tags_arr.indexOf(tag)], 16);
  }
  //console.log(var_val_arr);
  a = document.getElementsByClassName("svg_chart");
  for (var i in a) if (a.hasOwnProperty(i))
  {
    svg_chart(a[i], var_val_arr);
  }
  
  return "done";
}