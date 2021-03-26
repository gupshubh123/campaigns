import React from 'react';
import { mount,configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import CampaignManagement from './campaignmanagement'
configure({adapter:new Adapter()})

describe('Campaign Date change',()=>{
    let wrapper;

    beforeEach(()=>{
      wrapper = mount(<CampaignManagement />)
    })

    it('should change text on webpage to German on changing the language tab to German',()=>{
      let germanBtn = wrapper.find('span#langgr');
      expect(germanBtn.length).toBe(1);
      germanBtn.simulate('click');
      expect(wrapper.find("div.sectionHeading").text()).toEqual("Kampagne verwalten")
      expect(wrapper.find("div.upcoming").text()).toEqual("Kommende Kampagne")
      expect(wrapper.find("div.live").text()).toEqual("Aktuelle Kampagne")
      expect(wrapper.find("div.past").text()).toEqual("Alte Kampagne")
    })

    
    it('should move one past event to current live event', () => {
        let eventCheck = wrapper.find('#campaignRow-past-0');
        expect(eventCheck.length).toBe(0)

        wrapper.setState({
          isSelectedTab:'past',
          campaignData:[
            {
              name: "Summoners War",
              id: "1",
              region: "US",
              createdOn: 1484642600000,
              price: "100",
              csv: "Some CSV link for Whatsapp",
              report: "Some report link for Whatsapp",
              image_url: "img-1"
            }
          ]
        },()=>{wrapper.update()})
        wrapper.update()
        console.log(wrapper.html())
        eventCheck = wrapper.find('#campaignRow-past-0');
        expect(eventCheck.length).toBe(1)

        wrapper.setState({
          startDate: new Date(),
          isSelectedTab:'live',
          campaignData:[
            {
              name: "Summoners War",
              id: "1",
              region: "US",
              createdOn: new Date(),
              price: "100",
              csv: "Some CSV link for Whatsapp",
              report: "Some report link for Whatsapp",
              image_url: "img-1"
            }
          ]
        })



      eventCheck = wrapper.find('#campaignRow-live-0');
      expect(eventCheck.length).toBe(1)

    });


})