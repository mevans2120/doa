import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Singleton pages
      S.listItem()
        .title('Projects Page')
        .child(
          S.document()
            .schemaType('projectsPage')
            .documentId('projectsPage')
            .title('Projects Page')
        ),
      S.listItem()
        .title('Services Page')
        .child(
          S.document()
            .schemaType('servicesPage')
            .documentId('servicesPage')
            .title('Services Page')
        ),
      S.listItem()
        .title('Contact Page')
        .child(
          S.document()
            .schemaType('contactPage')
            .documentId('contactPage')
            .title('Contact Page')
        ),
      S.listItem()
        .title('Homepage Settings')
        .child(
          S.document()
            .schemaType('homepageSettings')
            .documentId('homepageSettings')
            .title('Homepage Settings')
        ),
      S.listItem()
        .title('About Page')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
            .title('About Page')
        ),
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
      S.listItem()
        .title('Email Settings')
        .child(
          S.document()
            .schemaType('emailSettings')
            .documentId('emailSettings')
            .title('Email Settings')
        ),

      S.divider(),

      // Document lists with delete enabled
      S.listItem()
        .title('Projects')
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .menuItems([
              S.menuItem()
                .title('Create new project')
                .intent({type: 'create', params: {type: 'project'}}),
            ])
        ),
      S.listItem()
        .title('Clients')
        .child(
          S.documentTypeList('client')
            .title('Clients')
            .menuItems([
              S.menuItem()
                .title('Create new client')
                .intent({type: 'create', params: {type: 'client'}}),
            ])
        ),
      S.listItem()
        .title('Testimonials')
        .child(
          S.documentTypeList('testimonial')
            .title('Testimonials')
            .menuItems([
              S.menuItem()
                .title('Create new testimonial')
                .intent({type: 'create', params: {type: 'testimonial'}}),
            ])
        ),
      S.listItem()
        .title('Services')
        .child(
          S.documentTypeList('service')
            .title('Services')
            .menuItems([
              S.menuItem()
                .title('Create new service')
                .intent({type: 'create', params: {type: 'service'}}),
            ])
        ),
      S.listItem()
        .title('Team Members')
        .child(
          S.documentTypeList('teamMember')
            .title('Team Members')
            .menuItems([
              S.menuItem()
                .title('Create new team member')
                .intent({type: 'create', params: {type: 'teamMember'}}),
            ])
        )
    ])