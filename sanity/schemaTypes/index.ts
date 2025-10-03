import project from './project'
import client from './client'
import testimonial from './testimonial'
import service from './service'
import teamMember from './teamMember'
import siteSettings from './siteSettings'
import homepageSettings from './homepageSettings'
import { aboutPage } from './aboutPage'
import emailSettings from './emailSettings'
import contactPage from './contactPage'
import servicesPage from './servicesPage'
import projectsPage from './projectsPage'

// Objects
import responsiveImage from './objects/responsiveImage'

export const schemaTypes = [
  // Objects first
  responsiveImage,

  // Then documents
  project,
  client,
  testimonial,
  service,
  teamMember,
  siteSettings,
  homepageSettings,
  aboutPage,
  emailSettings,
  contactPage,
  servicesPage,
  projectsPage,
]