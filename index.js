const axios = require('axios');
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

require('dotenv').config();


/**
 * PLEASE ADD YOUR CREDENTIALS AND OPTIONS IN THE .env FILE (use .env-template to create one)
 */

const email = process.env.EMAIL.trim();
const password = process.env.PASSWORD.trim();
const orgName = process.env.ORG_NAME.trim();
const projectId = process.env.PROJECT_ID.trim();
const monthsToCheck = process.env.MONTHS.trim() || '6';

const apiUrl = 'https://api.codeship.com/v2';

const fetchBuildsPage = (page, token, orgId) => {
  return axios.get(`${apiUrl}/organizations/${orgId}/projects/${projectId}/builds`, {
    params: {
      page,
      per_page: 150,
    },
    headers: {
      Authorization: `${token}`
    }
  })
} 

const XMonthAgo = moment().subtract(monthsToCheck, 'months')

const run = async () => {
  try {
    const builds = [];
    // AUTH
    const authResponse = await axios.post(`${apiUrl}/auth`, {}, {
      auth: {
        username: email,
        password,
      },
    })
    const {
      organizations,
      access_token,
    } = authResponse.data
    const orgId = organizations.find(o => o.name === orgName)?.uuid
    if (!orgId) throw new Error('Org ID not found')

    let oldestDate = moment();

    let page = 1;
    do {
      console.log(`Fetching page: ${page}`);
      const res = await fetchBuildsPage(page, acce1ss_token, orgId);
      builds.push(...res.data.builds);
      console.log(`Builds fetched: ${builds.length} \n`);

      page++;
      oldestDate = moment(res.data?.builds.pop()?.queued_at);
      console.log(`Oldest build date: ${oldestDate.format('DD-MM-YYYY')}`)
      console.log(`------------------------ \n`);
    } while (XMonthAgo < oldestDate);

    let totalSeconds = 0;
    const filteredBuilds = builds.filter(b => moment(b.queued_at).isAfter(XMonthAgo))
    filteredBuilds.forEach(b => {
      const buildDuration = moment(b.finished_at).diff(moment(b.queued_at), 'seconds')
      totalSeconds += buildDuration
    });
    console.log(`
    For the past ${monthsToCheck} months:
    ---
      Total builds: ${filteredBuilds.length} \n
      Total Seconds: ${totalSeconds} \n
      Average build time: ${moment.duration(totalSeconds/filteredBuilds.length, 'seconds').format('hh:mm:ss')} (mm:ss) \n
      Per Month build time: ${moment.duration(totalSeconds/monthsToCheck, 'seconds').format('hh:mm:ss')} (hh:mm:ss) \n
    ---
    `)
  } catch (error) {
    console.error(error.message)
  }

}

run();