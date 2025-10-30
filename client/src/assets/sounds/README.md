# Sound Files for F1 DeFi Security Dashboard

This directory should contain the following sound effect files for the loading screen experience:

## Required Sound Files

1. **engine_idle.mp3** - Low engine idle sound (looping, quiet background)
2. **beep_light.mp3** - Electronic beep sound (0.2s, for F1 start lights)
3. **engine_rev.mp3** - Engine rev sound (2s, loud and powerful, for race start)
4. **tire_squeal.mp3** - Tire squeal sound (1s, for car starting movement)
5. **car_whoosh.mp3** - Whoosh/wind sound (2s, for car acceleration)
6. **milestone_click.mp3** - Subtle click sounds (0.1s, for progress milestones)
7. **victory_flag.mp3** - Victory sound (1s, checkered flag wave or crowd cheer)

## Sound Usage

- Volume: 60-70% (moderate level)
- Format: MP3 or OGG
- Pre-load all sounds to prevent lag
- User control: Mute button available in loading screen

## Where to Get Sound Files

You can obtain F1-themed sound effects from:
- Freesound.org (Creative Commons license)
- Zapsplat.com (free sound effects)
- Create your own using audio editing software
- Use royalty-free sound libraries

## Implementation Note

The application will gracefully handle missing sound files by continuing without audio.
Place your sound files directly in this directory with the exact filenames listed above.
