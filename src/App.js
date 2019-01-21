import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import logo from './assets/swlogo.svg';

import featureCode from './assets/home/code.svg';
import featureIdeas from './assets/home/ideas.svg';
import featureTime from './assets/home/time.svg';

import demoBurberry from './assets/home/burberry.png';
import demoHeadline from './assets/home/football.png';
import demoSlurp from './assets/home/slurp.jpg';

import { CSSTransition } from 'react-transition-group';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import {
  Route,
  Link,
  Switch,
  withRouter
} from 'react-router-dom'


/// HEADER ///

class Header extends Component {
  render() {
    return (
      <header>
        <section className="header">
          <Link to='/' className="logo"><img src={logo}  alt="logo"/></Link>
          <nav>
            <Link to='/about'>About</Link>
          </nav>
        </section>
      </header>
    );
  }
}

class Hero extends Component {
  constructor(props) {
    super(props);
    this.title = props.title;
    this.background = props.background;
  }

  render() {
    return (
      <section className="hero">

        {/* <div id="overlay"></div> */}
        <TiltBg options={{}}>
        </TiltBg>
        <div id="heroHolder">
          <UserInfo name={this.title}/>
        </div>
        <TriangleBtm/>
      </section>
    );
  }
}

function UserInfo(props) {
  return (
    <h1>{props.name}</h1>
  );
}

class TiltBg extends Component {
  constructor(props) {
    super(props)
    this.state = {
      style: {}
    }
    const defaultSettings = {
      reverse: false,
      max: 15,
      perspective: 1000,
      easing: 'cubic-bezier(.03,.98,.52,.99)',
      scale: '1',
      speed: '1000',
      transition: true,
      axis: null,
      reset: true
    }
    this.width = null
    this.height = null
    this.left = null
    this.top = null
    this.transitionTimeout = null
    this.updateCall = null
    this.element = null
    this.settings = {
      ...defaultSettings,
      ...this.props.options,
    }
    this.reverse = this.settings.reverse ? -1 : 1
    this.handleMouseEnter = this.handleMouseEnter.bind(this, this.props.handleMouseEnter)
    this.handleMouseMove = this.handleMouseMove.bind(this, this.props.handleMouseMove)
    this.handleMouseLeave = this.handleMouseLeave.bind(this, this.props.handleMouseLeave)
  }
  componentDidMount() {
    this.element = findDOMNode(this)
  }
  componentWillUnmount() {
    clearTimeout(this.transitionTimeout)
    cancelAnimationFrame(this.updateCall)
  }
  handleMouseEnter(cb = () => { }, e) {
    this.updateElementPosition()
    this.setTransition()
    return cb(e)
  }
  reset() {
    window.requestAnimationFrame(() => {
      this.setState(prevState => ({
        style: {
          ...prevState.style,
          transform: `perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        }
      }))
    })
  }
  handleMouseMove(cb = () => { }, e) {
    e.persist()
    if (this.updateCall !== null) {
      window.cancelAnimationFrame(this.updateCall)
    }
    this.event = e
    this.updateCall = requestAnimationFrame(this.update.bind(this, e))
    return cb(e)
  }
  setTransition() {
    clearTimeout(this.transitionTimeout)
    this.setState(prevState => ({
      style: {
        ...prevState.style,
        transition: `${this.settings.speed}ms ${this.settings.easing}`,
      }
    }))
    this.transitionTimeout = setTimeout(() => {
      this.setState(prevState => ({
        style: {
          ...prevState.style,
          transition: '',
        }
      }))
    }, this.settings.speed)
  }
  handleMouseLeave(cb = () => { }, e) {
    this.setTransition()
    if (this.settings.reset) {
      this.reset()
    }
    return cb(e)
  }
  getValues(e) {
    const x = (e.nativeEvent.clientX - this.left) / this.width
    const y = (e.nativeEvent.clientY - this.top) / this.height
    const _x = Math.min(Math.max(x, 0), 1)
    const _y = Math.min(Math.max(y, 0), 1)
    const tiltX = (this.reverse * (this.settings.max / 2 - _x * this.settings.max)).toFixed(2)
    const tiltY = (this.reverse * (_y * this.settings.max -   this.settings.max / 2)).toFixed(2)
    const percentageX = _x * 100
    const percentageY = _y * 100
    return {
      tiltX,
      tiltY,
      percentageX,
      percentageY,
    }
  }
  updateElementPosition() {
    const rect = this.element.getBoundingClientRect()
    this.width = this.element.offsetWidth
    this.height = this.element.offsetHeight
    this.left = rect.left
    this.top = rect.top
  }
  update(e) {
    const values = this.getValues(e)
    this.setState(prevState => ({
      style: {
        ...prevState.style,
        transform: `perspective(${this.settings.perspective}px) rotateX(${this.settings.axis === 'x' ? 0 : values.tiltY}deg) rotateY(${this.settings.axis === 'y' ? 0 : values.tiltX}deg) scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})`,
      }
    }))
    this.updateCall = null
  }
  render() {
    const style = {
      ...this.props.style,
      ...this.state.style
    }
    return (
      <div className="tiltbg"
        style={style}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.children}
      </div>
    )
  }
}



/// LAYOUT ///

class TriangleBtm extends Component {
  render() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon fill="#F9F9F9" points="0,100 100,0 100,100"/>
        </svg>
    );
  }
}

class TriangleTop extends Component {
  render() {
    return (
        <svg id="footer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon fill="#F9F9F9" points="100,0 0,100 0,0"/>
        </svg>
    );
  }
}

class Home extends Component {
  componentDidUpdate() {
    window.scrollTo(0,0);
  }
  constructor(props) {
    super(props);
    this.title = 'Hi, I am Sam Wightwick Creative developer.';
  }
  render() {
    return (
      <div>
        <Hero title={this.title}/>
        <AllProjects/>
        <Features/>
        <Personaldemos/>
      </div>
    );
  }
}


/// PROJECTS ///

var Projectlist = {
  projects: [
    { number: 1,
      name: "LESS EFFORT",
      slug: "less-effort",
      link: "https://www.lesseffort.co.uk",
      headline: "Streetwear clothing label store and every aspect of brand creation and development",
      year: "2015",
      image1: "../assets/1-less-effort/less-effort-main.jpg",
      image2: "../assets/1-less-effort/less-effort-shop.jpg",
      image3: "../assets/1-less-effort/less-effort-product.jpg",
      image4: "../assets/1-less-effort/less-effort-mobile.jpg",
      image5: "/",
      para1: "Less Effort is a small clothing label that I created with a close friend in late 2012. The brand is aimed at people into BMX, skateboarding, hip hop music and graffiti cultures and generally supports and encourages creativity." ,
      para2: "The core of Less Effort is smart, affordable streetwear clothing. The artwork is created in house, and is promoted via Facebook, competitions, Tumblr and Instagram. We also work with people we have met online, friends and through various activities internationally." ,
      para3: "I created the online store using Kirby CMS and Snipcart. The first version was made with WordPress and the Woo commerce plugin for the store. The design is minimalistic and is fully responsive. This is especially important when gaining followers through social media, as most users will be on a mobile." ,
      para4: "Kirby is a flat file CMS with some powerful features and a light footprint. Data is stored in text files rather than a MySQL database which I see as a big advantage. All site assests are minified and gzipped. The whole site is fast and responsive. I used the javascript cart by Snipcart for the checkout, which is an external service for all of our payment transactions." },
    { number: 2,
      name: "MIND POWER COMPOSITION", 
      slug: "mpc",
      link: "https://ringzovsaturn.com/mpc",
      headline: "Interactive drum machine style video player featuring a UK hip hop documentary",
      year: "2016", 
      image1: "../assets/2-Mind-Power-Composition/mpc-main.jpg",
      image2: "../assets/2-Mind-Power-Composition/mpc-detail.jpg",
      image3: "../assets/2-Mind-Power-Composition/mpc-iphone-1.jpg",
      image4: "../assets/2-Mind-Power-Composition/mpc-iphone-2.jpg",
      image5: "/",
      para1: "Mind Power Composition (MPC) is a video documentary series, focusing on UK hip hop producers thoughts and processes used to create their music. The creator of the series asked me to make a site that could showcase the artists and videos in a more interesting way than just using a Youtube channel.",
      para2: "I developed the concept of replicating the drum pads of a physical drum machine, loosely based on an Akai MPC - an instrument majority of producers featured in the video would be using to create music and would be a familiar interface for those likely to be interested in the project. The producers each had their own pad in a grid of 4 by 4, totalling 16. The pads reveal the producer name upon hover and expand once clicked in a google image search style, revealing a producer bio and the artists part of the documentary video embedded from Youtube.",
      para3: "The design for mobile was a decision on wether to keep the pads in the grid of sixteen or stack every pad in a column. I opted for the original grid of 16 to keep in line with the drum pad feel, and also thought the concept of a mini drum machine in browser on your phone was quite fun and something users would share with their friends. On medium and below sized screens, I used jQuery to measure the available space, then append the size to the pad grid container after subtracting margins and padding. This achieves a proportional scaling down of the pads on any device.",
      para4: "The project was a lot of fun to work on. Handling direction, design and development myself was a great task and I am pleased to say the project has been very well received. The videos have been popular and the site has attracted a sponsor for the project a couple weeks after launch",
    },
    { number: 3,
      name: "MONSTERS INK",
      slug: "monsters-ink", 
      link: "///",
      headline: "Interactive exhibition piece powered by Node.js",
      year: "2017",
      image1: "../assets/3-monsters-ink/monsters-main.jpg",
      image2: "../assets/3-monsters-ink/monsters-ink-detail.jpg",
      image3: "../assets/3-monsters-ink/monsters-ink-sheet.jpg",
      image4: "../assets/3-monsters-ink/monsters-ink-city.png",
      image5: "../assets/3-monsters-ink/monsters-ink-stand.png",
      para1: "Monsters Ink was a project I was part of whilst working for Pretty agency. The initial concept was to provide an interactive element to the clients display stand at a large event.",
      para2: "We developed the idea of colouring in a monster template using the clients products, then seeing it come to life on screen. We decided 3 monsters would be the right amount, so there is just enough happening at once on screen, but not too much going on. A city scape for the monsters to walk around was created, and a template for the monsters was also made.",
      para3: "The 3 monsters were defined based on the main animation they perform - Angry, Flying and Scooting monsters were all animated across a city backdrop. When a new scan is processed an older scan is deleted. The screen only shows the last 3 visitors designs for each type of monster, ensuring that there is always relatively something new on the screen, and if you are a visitor awaiting to see your monster, you will not have to wait around too long.",
      para4: "Once the concept and designs had been decided we had to make the pieces all work together. Our setup consisted of a laptop and scanner (image processing) locally connected to a Mac mini (Converting images to web elements) with a projector or large screen as a monitor.",
      para5: "We used Node JS to create a local web server and listen for new incoming scans, and Grunt was used to automate tasks we needed to perform such as processing scans and moving and rotating images. Node modules which were of great help include Node inspector, Nodemon, SVG 2 PNG",
    },
    { number: 4, 
      name: "COMPANY CORPORATE SITE", 
      slug: "co-site",
      link: "///",
      headline: "Informative business corporate site",
      year: "2016", 
      image1: "../assets/4-company-corporate-site/etx-main.jpg",
      image2: "../assets/4-company-corporate-site/etx-map.jpg",
      image3: "../assets/4-company-corporate-site/etx-layout.jpg",
      image4: "../assets/4-company-corporate-site/etx-header.jpg",
      image5: "../assets/4-company-corporate-site/etx-mobile-menu.jpg",
      para1: "Whilst working at Pretty agency, I was part of the team that worked with a large trading company in the city. We rebranded their trading application and supporting web sites, including the site for their corporate company.",
      para2: "The site was designed by pretty and had to include lots of facts and figures about the company to easily convey their details to customers and clients small and large.",
      para3: "We built the site using Foundation 5 and Sass. D3 was used for the interactive charts, and animate.css for the majority of pictures and app mock ups for interactivity.",
      para4: "Custom javascript elements were made for the mega menu and office selector map area which were made to work on mobile too."},
    { number: 5, 
      name: "GREATER GOOD", 
      slug: "greater-good", 
      link: "///",
      headline: "Beat store for a local music producer",
      year: "2017", 
      image1: "../assets/5-greater-good/greater-good-main.jpg" ,
      image2: "../assets/5-greater-good/greater-good-tracks.jpg" ,
      image3: "../assets/5-greater-good/greater-good-detail.jpg" ,
      image4: "/",
      image5: "/",
      para1: "Greater good is a local beatmaker and producer. His musical styles are mainly hip hop but vary onto instrumentals and soundscapes. I designed and built a simple site showcasing his work in Vue.js.",
      para2: "You can stream and purchase music from the site, with payments processed by Stripe."},
    { number: 6, 
      name: "RESPONSIVE E-MAILS & BANNERS", 
      slug: "emails",
      link: "///",
      headline: "E-mails and banners viewed by the thousands across multiple devices",
      year: "2017", 
      image1: "../assets/6-responsive-e-mails-banners/email-main.jpg" ,
      image2: "../assets/6-responsive-e-mails-banners/repsonsive-email-army.jpg" ,
      image3: "../assets/6-responsive-e-mails-banners/responsive-email-bike.jpg" ,
      image4: "../assets/6-responsive-e-mails-banners/plusnet-banner.jpg" ,
      image5: "../assets/6-responsive-e-mails-banners/airline-banner.jpg",
      para1: "During my time at a London advertising agency, I worked on large digital marketing campaigns which involved e-mails. The e-mails that were built are responsive and display consistently across all clients on mobile and desktop.",
      para2: "E-mail is still very much behind the web in terms of coding, e-mails still need to be built in tables, image heavy, and inlined CSS. However, as standard I was able to make the e-mail builds work across Outlook 2000 - 2016 for OS-X and Windows, all web based email clients and mobile devices. Each client has its own caveats to look out for, and after a lot of work and testing they were delivering well. It was especially important that the e-mails look was consistent across devices as some of the e-mails were going to thousands of customers at once delivering the message of the campaign.",
      para3: "We also developed a system based from the email framework by Zurb. Sections of e-emails have been split into modules, and templates are built and data injected using Handlebars template system.",
      para4: "",
      para5: "After the long awaited death of flash, animated banners are thankfully built in modern web technologies, and utilise CSS3 animation and javascript as used on normal web sites. These banners were for active marketing campaigns and required a quick turn around delivery time. The banners were delivered to sites through the Google Double Click network.",
      para6: "During my time at Gravity London we created a lot of Greensock based banners and we developed a custom build process. Elements such as CTAs and shadows are generated by passing banner specific values to functions to create the elements rather than coding from scratch. Production builds were processed with Gulp which handles optimization, compression, and bundling."
    }
  ],
  all: function() { return this.projects},
  get: function(id) {
    const isProject = p => p.number === id
    return this.projects.find(isProject)
  }
}

class AllProjects extends Component {
  constructor() {
    super();
    this.state = {
       className: 'hidden'
    }
  }
  handleScroll() { 
   if (window.pageYOffset || document.documentElement.scrollTop > 220) {
      this.setState({
        className: 'show'
      })
    } 
  }
  componentDidMount() {
    window.onscroll = () => this.handleScroll()
  }
  render() {
    return (
      <section id="allProjects" className={this.state.className}>
      { Projectlist.all().map(p => (
          <article className="homeProject" key={p.number}>
            <Link to={`/projects/${p.number}`}>
                <div className="preview">
                  <div className="image">
                    <img src={p.image1} alt={p.name}/>
                    <figcaption>
                    <h1>{p.name}</h1>
                    <span>{p.headline}</span>
                  </figcaption>
                  </div>
                </div>
            </Link>
          </article>
        ))
      }
    </section>
    );
  }
}

class Project extends Component {
  render() {
    const project = Projectlist.get(
      parseInt(this.props.match.params.number, 10)
    )
    if (!project) {
      return <div>Sorry, but the project was not found</div>
    }
    return (
    <div>
      <ProjectHero title={project.name} slug={project.slug}/>
      <section className={`project ${project.slug}`}>
          <img src={project.image1} alt={project.name}/>
          <p>{project.para1}</p>
          <p>{project.para2}</p>
          <img src={project.image2} alt={project.name}/>
          <p>{project.para3}</p>
          <p>{project.para4}</p>
          <img src={project.image3} alt={project.name}/>
          <p>{project.para5}</p>
          <img src={project.image4} alt={project.name}/>
          <p>{project.para6}</p>
          <img src={project.image5} alt={project.name}/>
          <a href={project.link} className="projectLink" target="_blank" rel="noopener noreferrer">Project website</a>
          <Link to='/' className="homeLink">Back home</Link>
      </section>
      </div>
    )
  }
}

class ProjectHero extends Component {
  constructor(props) {
    super(props);
    this.title = props.title;
    this.slug = props.slug;
  }
  render() {
    return (
      <section className={`hero ${this.slug}`}>
        <div id="heroHolder">
          <UserInfo name={this.title}/>
        </div>
        <TriangleBtm/>
      </section>
    );
  }
}

const Projects = () => (
  <Switch>
    <Route exact path='/projects' component={AllProjects}/>
    <Route path='/projects/:number' component={Project}/>
  </Switch>
  
)

/// ABOUT ///

const Aboutpage = () => (
  <div>
  <section className="about">
    <p>I am Sam Wightwick, a creative front-end developer and building websites is my passion. I particularly enjoy user interaction, animations and mobile. I have previously worked and partaken in design and direction on various projects, which gives me a greater understanding of the whole project process.</p>
    <p>Out of work I regularly challenge myself with personal projects and experiments, with the aim to build something new or learn a new language. I also enjoy photography, graffiti and travelling which mix in with my style and skill set.</p>
  </section>
  <Links/>
  <section className="skillbox">
    <div className="columns">
      <div className="skills">
        <ul>
          <li>CODE</li>
          <li>HTML5 & CSS3</li>
          <li>Sass & Less</li>
          <li>Javascript</li>
          <li>Vue.js</li>
          <li>Animated banners (Greensock)</li>
          <li>Responsive emails</li>
        </ul>
      </div>
      <div className="skills">    
        <ul>
          <li>CMS</li>
          <li>Wordpress</li>
          <li>Woocommerce</li>
          <li>Magento</li>
          <li>Kirby</li>
          <li>Grav</li>
        </ul>
      </div>
      <div className="skills">    
        <ul>
          <li>SERVER</li>
          <li>Node</li>
          <li>Apache</li>
          <li>VirtualBox</li>
          <li>Heroku</li>
        </ul>
      </div>
      <div className="skills">    
        <ul>
          <li>TOOLING</li>
          <li>Gulp</li>
          <li>NPM</li>
          <li>Github</li>
          <li>Terminal</li>
        </ul>
      </div>
      <div className="skills">    
        <ul>
          <li>OFFICE</li>
          <li>Creative Suite</li>
          <li>Sketch</li>
          <li>Trello</li>
          <li>Slack</li>
          <li>Harvest</li>
        </ul>
      </div>
    </div>
  </section>
  </div>
)

class Links extends Component {
  render() {
    return (
      <section className="aboutLinks">
        <a href="https://github.com/swightwick" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 128 128" fill="#82719B">
            <path d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"></path><path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm-.743-.55M28.93 94.535c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zm-.575-.618M31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm0 0M34.573 101.373c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm0 0M39.073 103.324c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm0 0M44.016 103.685c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm0 0M48.614 102.903c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path>
          </svg>
        </a>
        <a href="https://twitter.com/samwightwick" target="_blank" rel="noopener noreferrer">
          <svg version="1.1" x="0px" fill="#82719B" y="0px" width="612px" height="612px" viewBox="0 0 612 612">
            <path d="M612,306C612,137.004,474.995,0,306,0C137.004,0,0,137.004,0,306c0,168.995,137.004,306,306,306
              C474.995,612,612,474.995,612,306z M141.233,414.741c5.286,0.668,10.682,1.029,16.135,1.029
              c31.685,0.056,60.838-11.378,83.955-30.572c-29.599-0.695-54.551-21.614-63.147-50.323c4.117,0.862,8.374,1.363,12.713,1.392
              c6.176,0.027,12.129-0.808,17.804-2.421c-30.934-6.843-54.245-36.191-54.245-71.159c0-0.306,0-0.612,0-0.918
              c9.124,5.508,19.528,8.846,30.627,9.347c-18.109-13.103-30.043-35.357-30.043-60.394c0-13.241,3.338-25.593,9.152-36.164
              c33.354,44.092,83.176,73.356,139.341,77c-1.168-5.257-1.753-10.738-1.753-16.329c0-39.53,30.267-71.075,67.599-70.463
              c19.444,0.334,37.025,9.263,49.35,23.284c15.411-2.949,29.876-8.624,42.923-16.552c-5.035,16.496-15.772,30.238-29.737,38.834
              c13.687-1.53,26.705-5.146,38.834-10.626c-9.068,14.104-20.53,26.427-33.743,36.275c0.139,3.06,0.194,6.12,0.194,9.18
              c0,93.859-68.016,202.099-192.363,202.043C206.689,447.232,171.138,435.271,141.233,414.741z"/>
          </svg>
        </a>
        <a href="https://dribbble.com/samwightwick" target="_blank" rel="noopener noreferrer">
          <svg version="1.1" fill="#82719B" x="0px" y="0px" viewBox="0 0 430.117 430.118">
            <path id="Dribbble" d="M215.05,0C96.274,0.009,0,96.289,0,215.068c0,118.758,96.274,215.049,215.05,215.049
              c118.776,0,215.054-96.291,215.067-215.049C430.104,96.289,333.826,0.009,215.05,0z M346.819,111.506
              c20.983,26.645,34.121,59.638,35.778,95.668c-24.278-5.153-47.217-7.661-68.602-7.661v-0.005h-0.158
              c-17.217,0-33.375,1.563-48.604,4.264c-3.701-9.071-7.453-17.784-11.233-26.129C287.916,162.767,320.47,141.585,346.819,111.506z
              M215.05,47.28c39.576,0,75.882,13.836,104.626,36.87c-21.996,26.334-51.029,45.406-82.393,58.873
              c-22.038-42.615-43.333-73.101-57.89-91.739C190.916,48.727,202.81,47.28,215.05,47.28z M140.941,64.77
              c11.646,13.756,34.963,44.013,59.867,91.253c-50.649,15.077-101.651,18.619-132.51,18.61c-0.88,0-1.75,0-2.604-0.009h-0.028
              c-5.197,0-9.666-0.082-13.397-0.196C64.308,126.254,97.311,86.357,140.941,64.77z M47.266,215.068c0-0.789,0.028-1.591,0.075-2.417
              c4.791,0.177,10.935,0.329,18.33,0.329h0.042c33.727-0.22,92.614-3.038,152.292-21.879c3.253,7.113,6.473,14.519,9.656,22.208
              c-39.853,13.329-71.241,34.564-94.457,55.711C110.854,289.377,95.754,309.54,86.931,323
              C62.242,293.769,47.279,256.204,47.266,215.068z M215.05,382.859c-37.339,0-71.754-12.349-99.673-33.07
              c5.934-9.773,18.657-28.535,38.917-47.922c20.845-19.975,49.62-40.538,87.19-52.775c12.77,35.797,24.325,76.718,33.127,122.781
              C256.068,378.934,236.032,382.859,215.05,382.859z M310.011,353.065c-8.513-41.659-19.215-79.224-30.966-112.748
              c10.897-1.563,22.336-2.445,34.41-2.445h0.434h0.028h0.028c20.012,0,42.003,2.487,65.852,7.906
              C371.541,290.143,345.844,328.352,310.011,353.065z"/>
          </svg>
        </a>

        <a href="https://codepen.io/swightwick/" target="_blank" rel="noopener noreferrer">
          <svg version="1.1" id="codepen" fill="#82719B" x="0px" y="0px" viewBox="0 0 500 500">
            <polygon points="130,226.7 130,268.7 161.4,247.7 	"/>
            <polygon points="238.5,196.1 238.5,137.5 140,203.2 184,232.6 	"/>
            <polygon points="362.1,203.2 263.6,137.5 263.6,196.1 318.1,232.6 	"/>
            <polygon points="140,292.3 238.5,357.9 238.5,299.3 184,262.8 	"/>
            <polygon points="263.6,299.3 263.6,357.9 362.1,292.3 318.1,262.8 	"/>
            <polygon points="251.1,218 206.6,247.7 251.1,277.4 295.5,247.7 	"/>
            <path d="M251.1,11.2c-130.6,0-236.5,105.9-236.5,236.5c0,130.6,105.9,236.5,236.5,236.5c130.6,0,236.5-105.9,236.5-236.5
              C487.6,117.1,381.7,11.2,251.1,11.2z M397.3,292.3c0,0.6,0,1.1-0.1,1.6c0,0.2-0.1,0.4-0.1,0.5c-0.1,0.4-0.1,0.7-0.2,1.1
              c-0.1,0.2-0.1,0.4-0.2,0.6c-0.1,0.3-0.2,0.6-0.3,0.9c-0.1,0.2-0.2,0.4-0.3,0.6c-0.1,0.3-0.3,0.6-0.4,0.8c-0.1,0.2-0.2,0.4-0.4,0.6
              c-0.2,0.3-0.3,0.5-0.5,0.8c-0.1,0.2-0.3,0.4-0.4,0.5c-0.2,0.2-0.4,0.5-0.6,0.7c-0.2,0.2-0.3,0.3-0.5,0.5c-0.2,0.2-0.5,0.4-0.7,0.6
              c-0.2,0.1-0.4,0.3-0.6,0.4c-0.1,0-0.1,0.1-0.2,0.2L258,391.9c-2.1,1.4-4.5,2.1-7,2.1c-2.4,0-4.9-0.7-7-2.1l-133.7-89.1
              c-0.1,0-0.1-0.1-0.2-0.2c-0.2-0.1-0.4-0.3-0.6-0.4c-0.2-0.2-0.5-0.4-0.7-0.6c-0.2-0.2-0.3-0.3-0.5-0.5c-0.2-0.2-0.4-0.4-0.6-0.7
              c-0.1-0.2-0.3-0.4-0.4-0.5c-0.2-0.2-0.4-0.5-0.5-0.8c-0.1-0.2-0.2-0.4-0.4-0.6c-0.2-0.3-0.3-0.6-0.4-0.8c-0.1-0.2-0.2-0.4-0.3-0.6
              c-0.1-0.3-0.2-0.6-0.3-0.9c-0.1-0.2-0.1-0.4-0.2-0.6c-0.1-0.3-0.2-0.7-0.2-1.1c0-0.2-0.1-0.4-0.1-0.5c-0.1-0.5-0.1-1.1-0.1-1.6
              v-89.1c0-0.6,0-1.1,0.1-1.6c0-0.2,0.1-0.4,0.1-0.5c0.1-0.4,0.1-0.7,0.2-1.1c0.1-0.2,0.1-0.4,0.2-0.6c0.1-0.3,0.2-0.6,0.3-0.9
              c0.1-0.2,0.2-0.4,0.3-0.6c0.1-0.3,0.3-0.6,0.4-0.8c0.1-0.2,0.2-0.4,0.4-0.6c0.2-0.3,0.3-0.5,0.5-0.8c0.1-0.2,0.3-0.4,0.4-0.5
              c0.2-0.2,0.4-0.5,0.6-0.7c0.2-0.2,0.3-0.3,0.5-0.5c0.2-0.2,0.5-0.4,0.7-0.6c0.2-0.1,0.4-0.3,0.6-0.4c0.1,0,0.1-0.1,0.2-0.2
              l133.7-89.1c4.2-2.8,9.7-2.8,13.9,0l133.7,89.1c0.1,0,0.1,0.1,0.2,0.2c0.2,0.1,0.4,0.3,0.6,0.4c0.2,0.2,0.5,0.4,0.7,0.6
              c0.2,0.2,0.3,0.3,0.5,0.5c0.2,0.2,0.4,0.4,0.6,0.7c0.2,0.2,0.3,0.4,0.4,0.5c0.2,0.2,0.4,0.5,0.5,0.8c0.1,0.2,0.2,0.4,0.4,0.6
              c0.2,0.3,0.3,0.5,0.4,0.8c0.1,0.2,0.2,0.4,0.3,0.6c0.1,0.3,0.2,0.6,0.3,0.9c0.1,0.2,0.1,0.4,0.2,0.6c0.1,0.3,0.2,0.7,0.2,1.1
              c0,0.2,0.1,0.4,0.1,0.5c0.1,0.5,0.1,1.1,0.1,1.6V292.3z"/>
            <polygon points="372.2,268.7 372.2,226.7 340.7,247.7 	"/>
          </svg>
        </a>
      </section>
    );
  }
}

class About extends Component {
  constructor(props) {
    super(props);
    this.title = 'About';
  }
  render() {
    return (
      <div>
        <Hero title={this.title}/>
        <Aboutpage/>
      </div>
    );
  }
}


/// FEATURES ///

var features = [
  {
    id: 1,
    name: 'Creative',
    about: 'I constantly have ideas and projects that I would love to make. Take a problem then see how technology can solve it.',
    icon: featureIdeas
  },
  {
    id: 2,
    name: 'Technical',
    about: 'I understand how computers work and operate. Ability to explain code and web to non-technical persons.',
    icon: featureCode
  },
  {
    id: 3,
    name: 'Focused',
    about: 'Projects scoped, planned, estimated, and structured to provide optimal working and on time delivery.',
    icon: featureTime
  }
]

class Features extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'active': false, 'class': 'album'};
  }
  componentDidMount() {
    if(this.state.active){
      this.setState({'active': false,'class': 'album'})
    }else{
      this.setState({'active': true,'class': 'active'})
    }
  }
  render () {
  return (
   <section id="features" className={this.state.class}>
      {
        features.map( function(props) {
            return(
              <article className="feature" key={props.id}>
                  <Iconbox icon={props.icon} />
                  <Headerbox name={props.name} />
                  <Info about={props.about} />
              </article>  
            )
        })       
      }
    </section>
  );
  }
}

function Headerbox(props) {
  return(
     <h1> {props.name} </h1>
  );
}
function Iconbox(props) {
  return(
     <img src={props.icon} alt={props.icon}/>
  );
}

function Info(props) {
  return(
      <p> {props.about} </p> 
  );
}


/// DEMOS ///

var demos = [
  {
    id: 1,
    name: 'Burberry Check Creator',
    about: 'Make your own Burberry Check in your colors. Built with Vue.',
    image: demoBurberry,
    link: 'https://codepen.io/swightwick/full/rpKOpJ/'
  },
  {
    id: 2,
    name: 'Football Headline Generator',
    about: 'Generate made up transfer headlines like the pros!',
    image: demoHeadline,
    link: 'https://swightwick.github.io/football-headline-generator/'
  },
  {
    id: 3,
    name: 'Gulp Slurp',
    about: 'Run build process gulp commands from a interface',
    image: demoSlurp,
    link: 'https://github.com/swightwick/Slurp-electron'
  }
]

class Personaldemos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'active': false, 'class': 'album'};
  }
  componentDidMount() {
    if(this.state.active){
      this.setState({'active': false,'class': 'album'})
    }else{
      this.setState({'active': true,'class': 'active'})
    }
  }
  render () {
  return (
    <section className={"demoProjects " + this.state.class}>
    <h1>Personal projects</h1>
      {
        demos.map( function(props) {
            return(
              <article className="demo" key={props.id}>
                <a href={props.link} target="_blank" rel="noopener noreferrer">
                  <img src={props.image} alt={props.image}/>
                    <div className="demoHolder">
                      <h2>{props.name}</h2>
                      <p>{props.about}</p>
                    </div>
                </a>
              </article>  
            )
        })       
      }
    </section>
  );
  }
}



/// MAIN ///

const Main = withRouter(({ location }) => (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames='fade'
        timeout={500}>
        <Switch location={location}>
        <Route exact path='/' component={Home}/>
        <Route path='/projects' component={Projects}/>
        <Route path='/about' component={About}/>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
)) 


const Footer = () => (
  <footer>
    <TriangleTop/>
      <div id="footerHolder">
        <svg id="footerLogo" xmlns="http://www.w3.org/2000/svg" width="96.942" height="96.941" viewBox="0 0 96.942 96.941"><path fill="#F9F9F9" d="M48.47 0C21.7 0 0 21.7 0 48.47s21.7 48.47 48.47 48.47 48.472-21.7 48.472-48.47S75.24 0 48.47 0zM72.4 59.59h-.003v.003H63.1v-8.87l-8.613 8.96H45.19V43.552s-.004 0-.004-.003c.002-.01.004-.022.004-.034 0-.12-.1-.217-.22-.217s-.216.097-.216.217l.002.02v3.122h-8.683l-6.607-3.267c-.035-.02-.076-.033-.12-.033-.134 0-.244.115-.244.26 0 .066.024.126.064.173.01.018.022.035.043.045l5.787 2.822h-.004l7.587 3.697-.02.037v7.83l-1.297 1.464H5.6l-1.153-1.296 7.274-8.002h8.654l7.203 3.49.002-.003c.037.027.084.045.134.045.13 0 .236-.11.236-.243 0-.12-.087-.22-.2-.237l-13.753-6.703.04-.08h-.052v-7.948l1.2-1.352h39.21v13.03c0 .004 0 .007.003.01-.003.01-.005.017-.005.026 0 .124.102.225.227.225.123 0 .225-.1.225-.225 0-.012 0-.02-.002-.032v-4.575l8.255-8.55h8.005l1.203 1.353v6.92h-.003v4.888c0 .122.1.22.22.22.123 0 .22-.098.22-.22v-4.66l8.26-8.51 10.235.006 1.256 1.414L72.4 59.59z"/></svg>
        <span>Sam Wightwick 2018</span>
      </div>
  </footer>
)

const Portfolio = () => (
  <div>
    <Header />
    <main>
      <Main />
      <Footer/>
    </main>
  </div>
)

export default Portfolio