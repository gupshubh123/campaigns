import React from 'react';
import { mount,configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';


import App from './App'
import CampaignManagement from './components/campaignManagement/campaignmanagement'

configure({adapter:new Adapter()})

describe('App Check ',()=>{
    it('Checks whether the component has mounted', () => {
        let wrapper = shallow(<App />);
        const cpm = wrapper.find(CampaignManagement);
         expect(cpm.exists()).toBe(true);

      });
})