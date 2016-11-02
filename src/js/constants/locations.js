const locations = {
  AC: {
    name: 'Academic Resource Centre',
    rooms: {
      AC223: {
        lat: 43.783731,
        lon: -79.186357,
      },
      AC231: {
        lon: 43.783826,
        lat: -79.186159,
      },
      AC332: {
        lat: 43.783953,
        lon: -79.186074,
      },
      AC334: {
        lat: 43.784014,
        lon: -79.186020,
      },
      AC222: {
        lat: 43.783679,
        lon: -79.186479,
      },
      AC227: {
        lat: 43.783908,
        lon: -79.186194,
      },
      AC228: {
        lat: 43.783900,
        lon: -79.186291,
      },
      AC250: {
        lat: 43.784068,
        lon: -79.186045,
      },
      AC251: {
        lat: 43.784026,
        lon: -79.186187,
      },
      AC251A: {
        lat: 43.783998,
        lon: -79.186214,
      },
      AC252: {
        lat: 43.784006,
        lon: -79.186150,
      },
      AC252A: {
        lat: 43.783978,
        lon: -79.186176,
      },
      AC253: {
        lat: 43.783974,
        lon: -79.186084,
      },
      AC253A: {
        lat: 43.783949,
        lon: -79.186109,
      },
      AC254: {
        lat: 43.783942,
        lon: -79.186057,
      },
      AC255: {
        lat: 43.784081,
        lon: -79.185930,
      },
      AC256: {
        lat: 43.784101,
        lon: -79.185966,
      },
      AC257: {
        lat: 43.784132,
        lon: -79.186034,
      },
      AC258: {
        lat: 43.784152,
        lon: -79.186072,
      },
      AC220: {
        lat: 43.783740,
        lon: -79.186574,
      },
    },
  },
  IC: {
    name: 'Instructional Centre',
    rooms: {
      IC120: {
        lat: 43.786767,
        lon: -79.190053,
      },
      IC130: {
        lat: 43.786596,
        lon: -79.189790,
      },
      IC200: {
        lat: 43.786772,
        lon: -79.189420,
      },
      IC204: {
        lat: 43.786828,
        lon: -79.189530,
      },
      IC208: {
        lat: 43.786892,
        lon: -79.189649,
      },
      IC212: {
        lat: 43.786953,
        lon: -79.189773,
      },
      IC220: {
        lat: 43.786754,
        lon: -79.190028,
      },
      IC230: {
        lat: 43.786587,
        lon: -79.189708,
      },
      IC300: {
        lat: 43.786758,
        lon: -79.189389,
      },
      IC302: {
        lat: 43.786803,
        lon: -79.189480,
      },
      IC320: {
        lat: 43.786741,
        lon: -79.190004,
      },
      IC326: {
        lat: 43.786652,
        lon: -79.189834,
      },
      IC328: {
        lat: 43.786621,
        lon: -79.189768,
      },
    },
  },
  AA: {
    name: 'Arts and Administration Building',
    rooms: {
      AA112: {
        lat: 43.784562,
        lon: -79.187200,
      },
      AA204: {
        lat: 43.784267,
        lon: -79.187530,
      },
      AA205: {
        lat: 43.784346,
        lon: -79.187519,
      },
      AA206: {
        lat: 43.784427,
        lon: -79.187503,
      },
      AA207: {
        lat: 43.784510,
        lon: -79.187488,
      },
      AA208: {
        lat: 43.784588,
        lon: -79.187472,
      },
      AA209: {
        lat: 43.784670,
        lon: -79.187455,
      },
    },
  },
  BV: {
    name: 'Bladen Wing',
    rooms: {
      BV355: {
        lat: 43.784418,
        lon: -79.186775,
      },
      BV359: {
        lat: 43.784350,
        lon: -79.186839,
      },
      BV361: {
        lat: 43.784303,
        lon: -79.186885,
      },
      BV363: {
        lat: 43.784230,
        lon: -79.186960,
      },
      // BV260
      // BV264
    },
  },
  HW: {
    name: 'Humanities Wing',
    rooms: {
      HW214: {
        lat: 43.783209,
        lon: -79.186905,
      },
      HW215: {
        lat: 43.783031,
        lon: -79.186947,
      },
      HW216: {
        lat: 43.782821,
        lon: -79.186947,
      },
      // HW308
      // HW402
      // HW408
    },
  },
  MW: {
    name: 'Social Sciences Building',
    rooms: {
      MW110: {
        lat: 43.782915,
        lon: -79.185778,
      },
      MW120: {
        lat: 43.782824,
        lon: -79.185893,
      },
      MW130: {
        lat: 43.782753,
        lon: -79.186008,
      },
      MW140: {
        lat: 43.782671,
        lon: -79.186106,
      },
      MW160: {
        lat: 43.782945,
        lon: -79.186094,
      },
      MW170: {
        lat: 43.782846,
        lon: -79.186226,
      },
      MW223: {
        lat: 43.782779,
        lon: -79.186002,
      },
      MW262: {
        lat: 43.782822,
        lon: -79.186268,
      },
      MW264: {
        lat: 43.782864,
        lon: -79.186215,
      },
      MW291: {
        lat: 43.782828,
        lon: -79.185917,
      },
    },
  },
  PO: {
    name: 'Portable Office',
    rooms: {
      PO101: {
        lat: 43.783761,
        lon: -79.188465,
      },
      PO102: {
        lat: 43.783841,
        lon: -79.188612,
      },
      PO103: {
        lat: 43.783916,
        lon: -79.188792,
      },
      PO104: {
        lat: 43.784208,
        lon: -79.189079,
      },
      PO105: {
        lat: 43.784282,
        lon: -79.188946,
      },
      PO106: {
        lat: 43.782855,
        lon: -79.185564,
      },
    },
  },
  SW: {
    name: 'Science Wing',
    rooms: {
      SW128: {
        lat: 43.783340,
        lon: -79.187987,
      },
      SW143: {
        lat: 43.783191,
        lon: -79.188748,
      },
      SW309: {
        lat: 43.783327,
        lon: -79.187978,
      },
      SW319: {
        lat: 43.783201,
        lon: -79.188759,
      },
    },
  },
  SY: {
    name: 'Science Research Building',
    rooms: {
      SY110: {
        lat: 43.783936,
        lon: -79.189414,
      },
    },
  },
};

export default locations;
