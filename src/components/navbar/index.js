import React, { Component, lazy } from 'react'

import { Header, Menu, Button, Icon } from 'semantic-ui-react'

import navCss from './index.css'
import blocks from '../../css/app.css'
import hamburger from './hamburger.css'

const MenuBar = lazy(() => import("../menubar/index"))

import {
  homePageUrl,
  adminComplainUrl,
  bookingUrl,
  eventUrl,
  complainUrl,
  registrationUrl,
  databaseUrl
} from '../../urls'

const hamburgerDefaultOptions = [
  'hamburger--minus',
  'hamburger--spin',
  'hamburger--squeeze'
]

export default class Nav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: 'home',
      activeSubGroup: 'facauth',
      sideBarVisibility: false,
      isMobile: false,
      width: 0
    }
  }

  resize = () => {
    if (this.state.width !== window.innerWidth) {
      this.setState({
        width: window.innerWidth,
        isMobile: window.innerWidth <= 1000,
      });
    }
  }

  componentDidMount() {
    this.resize();
    switch (location.pathname) {
      case homePageUrl(): {
        this.setState({
          activeSubGroup: 'facauth'
        })
        return
      }
      case adminComplainUrl(): {
        this.setState({
          activeSubGroup: 'complains'
        })
        return
      }
      case bookingUrl(): {
        this.setState({
          activeSubGroup: 'bookings'
        })
        return
      }
      case eventUrl(): {
        this.setState({
          activeSubGroup: 'events'
        })
        return
      }
      case registrationUrl(): {
        this.setState({
          activeSubGroup: 'register'
        })
        return
      }
      case databaseUrl(): {
        this.setState({
          activeSubGroup: 'database'
        })
        return
      }
    }
  }

  onSidebarClick = () => {
    this.setState({ sideBarVisibility: !this.state.sideBarVisibility });
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleGroupClick = (name, url) => {
    this.setState({ activeSubGroup: name })
    this.props.history.push(url)
  }

  render() {
    const { 
      activeItem,
      activeSubGroup,
      sideBarVisibility,
      isMobile
      } = this.state

    return (
      <React.Fragment>
        <Menu secondary styleName='navCss.upper_menu'>
          <Menu.Item>
            <Header>
              {this.props.constants.hostels[this.props.who_am_i.residence]}
            </Header>
          </Menu.Item>
          {this.props.who_am_i.isStudent ? (
            <Menu.Menu position='right' styleName="navCss.right-margin">
              <button
                styleName={`hamburger.hamburger hamburger.${
                (hamburgerDefaultOptions)[
                  Math.floor(
                  Math.random() *
                  Math.floor(
                    (hamburgerDefaultOptions).length
                  )
                )
                ]
                } ${sideBarVisibility ? 'hamburger.is-active' : ''}`}
                type='button'
                onClick={this.onSidebarClick}
                >
                <span styleName='hamburger.hamburger-box'>
                  <span styleName='hamburger.hamburger-inner' />
                </span>
              </button>
            </Menu.Menu>
            // <Menu.Menu position='right'>
            //   <Menu.Item styleName='blocks.zero-padding'>
            //     <Button
            //       styleName={
            //         location.pathname === '/bhawan_app/book_room/'
            //           ? 'blocks.disactive-button'
            //           : 'blocks.active-button'
            //       }
            //       onClick={() => {
            //         this.props.history.push(bookingUrl())
            //       }}
            //     >
            //       Book a Guest Room
            //     </Button>
            //   </Menu.Item>
            //   <Menu.Item styleName='blocks.zero-padding'>
            //     <Button
            //       styleName={
            //         location.pathname === '/bhawan_app/complain/'
            //           ? 'blocks.disactive-button'
            //           : 'blocks.active-button'
            //       }
            //       onClick={() => {
            //         this.props.history.push(complainUrl())
            //       }}
            //     >
            //       Register a Complaint
            //     </Button>
            //   </Menu.Item>
            // </Menu.Menu>
          ) : null}
        </Menu>
        {this.props.who_am_i.isAdmin && !this.props.who_am_i.isStudent ? (
          <Menu size='mini' secondary styleName='navCss.lower_menu'>
            <Menu.Item
              size='mini'
              name='complains'
              color='blue'
              styleName='navCss.navColor'
              active={activeSubGroup == 'complains'}
              onClick={() =>
                this.handleGroupClick('complains', '/bhawan_app/admin_complain')
              }
            >
              Complaints
            </Menu.Item>

            <Menu.Item
              size='mini'
              name='bookings'
              color='blue'
              styleName='navCss.navColor'
              active={activeSubGroup == 'bookings'}
              onClick={() =>
                this.handleGroupClick('bookings', '/bhawan_app/book_room')
              }
            >
              Guest Room Bookings
            </Menu.Item>

            <Menu.Item
              size='mini'
              name='events'
              color='blue'
              styleName='navCss.navColor'
              active={activeSubGroup == 'events'}
              onClick={() =>
                this.handleGroupClick('events', '/bhawan_app/events')
              }
            >
              Events
            </Menu.Item>

            <Menu.Item
              size='mini'
              name='facauth'
              color='blue'
              styleName='navCss.navColor'
              active={activeSubGroup == 'facauth'}
              onClick={() => this.handleGroupClick('facauth', '/bhawan_app/')}
            >
              Facilities and Authorities
            </Menu.Item>

            <Menu.Item
              size='mini'
              name='database'
              color='blue'
              styleName='navCss.navColor'
              active={activeSubGroup == 'database'}
              onClick={() => this.handleGroupClick('database', '/bhawan_app/database')}
            >
              Student Database
            </Menu.Item>

            <Menu.Item
              size='mini'
              name='register'
              color='blue'
              styleName='navCss.navColor'
              active={activeSubGroup == 'register'}
              onClick={() => this.handleGroupClick('register', '/bhawan_app/registration')}
            >
              Register New Student
            </Menu.Item>
          </Menu>
        ) : (
          <Menu size='mini' secondary styleName='navCss.lower_menu'>
            <Menu.Item size='mini'>
              <Icon
                name='angle left'
                styleName='navCss.cursor'
                onClick={() => {
                  this.props.history.goBack()
                }}
              />
              <Icon
                name='angle right'
                styleName='navCss.cursor'
                onClick={() => {
                  this.props.history.goForward()
                }}
              />
              {this.props.activeNav}
            </Menu.Item>
          </Menu>
        )}
        <div
         styleName={[
          "navCss.menu-div",
          "navCss.menu-bar",
          sideBarVisibility ? "" : "navCss.closed-menu-bar",
          ].join(" ")}
        >
          <MenuBar
            sidebarStatus={ sideBarVisibility }
            linkClick={this.onSidebarClick}
            styleName="blocks.main-menu"
            {...this.props}
            />
        </div>
      </React.Fragment>
    )
  }
}
