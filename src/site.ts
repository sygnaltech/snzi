
/*
 * Site
 */

import { IRouteHandler, Page } from "@sygnal/sse";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(localeData); 

// import gsap from 'gsap'; 
 

export class Site implements IRouteHandler {

  constructor() {
  }

  setup() {

    Page.loadEngineCSS("site.css"); 
   
  }

  exec() {

    // Put your site-level custom code here
    // it will have full access to the DOM 

     this.processFormattedDates(); 
    
  } 

  async loadLocale(locale: string): Promise<void> {
    try {
        const response = await fetch(`https://unpkg.com/dayjs/locale/${locale}.js`);
        const scriptText = await response.text();

        // Manually execute the script, ensuring 'dayjs' is available globally
        const scriptWrapper = new Function('require', 'module', 'exports', 'define', 'globalThis', scriptText);
        scriptWrapper(
          (mod: string) => mod === "dayjs" ? dayjs : {}, // Mock `require`
          { exports: {} },                               // Mock `module`
          {},                                            // Mock `exports`
          undefined,                                     // Mock `define` (not needed here)
          globalThis                                     // Provide the global object
        );

        // Set the locale in Day.js
        dayjs.locale(locale);
    } catch (error) {
        console.error(`Locale ${locale} could not be loaded, falling back to default.`);
        dayjs.locale('en');
    }
  }

  async processFormattedDates(): Promise<void> {
    // Get the locale from the <html> element's lang attribute
    const locale = document.documentElement.lang || 'en'; // Default to 'en' if no lang attribute

    // Load and set the locale dynamically
    await this.loadLocale(locale);



    // Set the locale in Day.js
//    dayjs.locale(locale);
    console.log("locale-switched", locale) 

    // Get all elements with the custom attribute `wfu-format-locale`
    const elements = document.querySelectorAll<HTMLElement>('[wfu-format-locale]');

    elements.forEach(element => {
        // Get the date string from the element's text content or any other attribute if required
        const dateString = element.textContent?.trim();
        if (!dateString) return; // Skip if there's no date string

        // Parse the date assuming ISO 8601 format
        const date = dayjs(dateString);
        if (!date.isValid()) return; // Skip if the date is invalid

        console.log(date, dateString); 

//        dayjs.extend(localizedFormat); 
// dayjs().format('L LT');

        // Get the format string from a custom attribute (e.g., `data-format`)
        const formatString = element.getAttribute('wfu-format') || 'LL';

        // Format the date according to the specified format and locale
        const formattedDate = date.format(formatString);
        console.log("Final formatted date :", formattedDate);

        // Update the element's content with the formatted date
        element.textContent = formattedDate;
    });
}


// Function to process and format dates based on custom attributes
processFormattedDates1(): void {
  // Get all elements with the custom attribute `wfu-format-locale`
  const elements = document.querySelectorAll<HTMLElement>('[wfu-format-locale]');

  elements.forEach(element => {
      // Get the date string from the element's text content or any other attribute if required
      const dateString = element.textContent?.trim();
      if (!dateString) return; // Skip if there's no date string

      // Parse the date assuming ISO 8601 format
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return; // Skip if the date is invalid

      // Get the locale from the `lang` attribute
      const locale = document.documentElement.lang || 'en-US'; // Default to 'en-US' if no lang attribute

      // Format the date according to the specified locale
      const formattedDate = new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      }).format(date);

      // Update the element's content with the formatted date
      element.textContent = formattedDate;
  });
}


}
