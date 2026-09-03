/**
 * THE PRINTHUB — CENTRALIZED PRINT PLACEMENT CALIBRATION REPOSITORY
 * Single Source of Truth for all physical print dimensions, coordinate systems,
 * wearer perspectives, and garment scale factors across all products and sizes.
 */

// Garment physical reference dimensions in inches per size
export const GARMENT_SIZE_DIMENSIONS = {
  'round-neck-tshirt': {
    XS: { widthInches: 18.0, heightInches: 26.0 },
    S:  { widthInches: 19.0, heightInches: 27.0 },
    M:  { widthInches: 20.0, heightInches: 28.0 },
    L:  { widthInches: 22.0, heightInches: 29.0 },
    XL: { widthInches: 24.0, heightInches: 30.0 },
    '2XL': { widthInches: 26.0, heightInches: 31.0 },
    '3XL': { widthInches: 28.0, heightInches: 32.0 },
  },
  'oversized-tshirt': {
    XS: { widthInches: 20.0, heightInches: 27.0 },
    S:  { widthInches: 21.0, heightInches: 28.0 },
    M:  { widthInches: 22.5, heightInches: 29.0 },
    L:  { widthInches: 24.5, heightInches: 30.0 },
    XL: { widthInches: 26.5, heightInches: 31.5 },
    '2XL': { widthInches: 28.5, heightInches: 32.5 },
    '3XL': { widthInches: 30.5, heightInches: 33.5 },
  },
  'polo-tshirt': {
    S:  { widthInches: 19.5, heightInches: 27.5 },
    M:  { widthInches: 20.5, heightInches: 28.5 },
    L:  { widthInches: 22.0, heightInches: 29.5 },
    XL: { widthInches: 24.0, heightInches: 30.5 },
    '2XL': { widthInches: 26.0, heightInches: 31.5 },
    '3XL': { widthInches: 28.0, heightInches: 32.5 },
  },
  'hoodie': {
    S:  { widthInches: 21.0, heightInches: 27.0 },
    M:  { widthInches: 22.5, heightInches: 28.0 },
    L:  { widthInches: 24.5, heightInches: 29.5 },
    XL: { widthInches: 26.5, heightInches: 31.0 },
    '2XL': { widthInches: 28.5, heightInches: 32.0 },
    '3XL': { widthInches: 30.5, heightInches: 33.0 },
  },
  'apron': {
    'One Size': { widthInches: 28.0, heightInches: 34.0 },
    L: { widthInches: 28.0, heightInches: 34.0 },
  },
  'cup': {
    '11oz': { widthInches: 8.5, heightInches: 3.75, diameterInches: 3.25 },
    L: { widthInches: 8.5, heightInches: 3.75, diameterInches: 3.25 },
  },
  'cap': {
    'One Size': { widthInches: 7.5, heightInches: 5.0 },
    L: { widthInches: 7.5, heightInches: 5.0 },
  },
  'badge': {
    '2.25"': { widthInches: 2.25, heightInches: 2.25 },
    L: { widthInches: 2.25, heightInches: 2.25 },
  },
};

/**
 * MASTER PRINT PLACEMENT CALIBRATIONS
 * Defines exact physical boundaries and normalized bounds {x, y, w, h} (0.0 to 1.0)
 *
 * NOTE ON WEARER PERSPECTIVE:
 * - When looking at garment FRONT:
 *   - Wearer's Left Chest is on the VIEWER'S RIGHT (x ~ 0.56)
 *   - Wearer's Right Chest is on the VIEWER'S LEFT (x ~ 0.22)
 *   - Wearer's Left Sleeve is on the VIEWER'S RIGHT (x ~ 0.76)
 *   - Wearer's Right Sleeve is on the VIEWER'S LEFT (x ~ 0.10)
 * - When looking at garment BACK:
 *   - Wearer's Left Back is on the VIEWER'S LEFT (x ~ 0.22)
 *   - Wearer's Right Back is on the VIEWER'S RIGHT (x ~ 0.56)
 */
export const MASTER_CALIBRATIONS = {
  // =========================================================================
  // 1. ROUND NECK T-SHIRT (REGULAR FIT)
  // =========================================================================
  'round-neck-tshirt': [
    {
      id: 'center_chest',
      name: 'Center Chest',
      shortDesc: 'Front-and-center high-visibility artwork area',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Center Chest',
      maxWidthInches: 12.0,
      maxHeightInches: 14.0,
      maxDimension: '12" × 14"',
      xOffsetInches: 0.0,
      yOffsetInches: 4.0,
      bounds: { x: 0.30, y: 0.22, w: 0.40, h: 0.44 },
      fee: 0,
      isPrimary: true,
    },
    {
      id: 'left_chest',
      name: 'Left Chest (Wearer Left / Pocket)',
      shortDesc: 'Subtle brand logo on wearer\'s left chest',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Wearer Left Chest',
      maxWidthInches: 4.0,
      maxHeightInches: 4.0,
      maxDimension: '4" × 4"',
      xOffsetInches: 4.0,
      yOffsetInches: 4.0,
      bounds: { x: 0.56, y: 0.22, w: 0.20, h: 0.20 },
      fee: 80,
    },
    {
      id: 'right_chest',
      name: 'Right Chest (Wearer Right)',
      shortDesc: 'Crest or emblem on wearer\'s right chest',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Wearer Right Chest',
      maxWidthInches: 4.0,
      maxHeightInches: 4.0,
      maxDimension: '4" × 4"',
      xOffsetInches: -4.0,
      yOffsetInches: 4.0,
      bounds: { x: 0.24, y: 0.22, w: 0.20, h: 0.20 },
      fee: 80,
    },
    {
      id: 'full_front',
      name: 'Full Front Poster',
      shortDesc: 'Large poster-sized graphic covering entire front torso',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Full Front Torso',
      maxWidthInches: 14.0,
      maxHeightInches: 16.0,
      maxDimension: '14" × 16"',
      xOffsetInches: 0.0,
      yOffsetInches: 3.5,
      bounds: { x: 0.26, y: 0.20, w: 0.48, h: 0.56 },
      fee: 120,
    },
    {
      id: 'upper_back',
      name: 'Upper Back / Neck',
      shortDesc: 'Subtle horizontal neck & shoulder brand print',
      surface: 'back',
      cameraView: 'back',
      wearerPosition: 'Upper Back / Neck',
      maxWidthInches: 12.0,
      maxHeightInches: 6.0,
      maxDimension: '12" × 6"',
      xOffsetInches: 0.0,
      yOffsetInches: 2.5,
      bounds: { x: 0.30, y: 0.18, w: 0.40, h: 0.20 },
      fee: 100,
    },
    {
      id: 'full_back',
      name: 'Full Back Statement',
      shortDesc: 'High-impact poster artwork across the back',
      surface: 'back',
      cameraView: 'back',
      wearerPosition: 'Full Back Torso',
      maxWidthInches: 14.0,
      maxHeightInches: 16.0,
      maxDimension: '14" × 16"',
      xOffsetInches: 0.0,
      yOffsetInches: 3.5,
      bounds: { x: 0.26, y: 0.20, w: 0.48, h: 0.56 },
      fee: 100,
    },
    {
      id: 'left_sleeve',
      name: 'Left Sleeve (Wearer Left)',
      shortDesc: 'Vertical lettering or sponsor badge along left sleeve',
      surface: 'left',
      cameraView: 'left',
      wearerPosition: 'Wearer Left Sleeve',
      maxWidthInches: 4.0,
      maxHeightInches: 10.0,
      maxDimension: '4" × 10"',
      xOffsetInches: 0.0,
      yOffsetInches: 2.0,
      bounds: { x: 0.72, y: 0.26, w: 0.18, h: 0.26 },
      fee: 80,
    },
    {
      id: 'right_sleeve',
      name: 'Right Sleeve (Wearer Right)',
      shortDesc: 'Vertical lettering or flag icon along right sleeve',
      surface: 'right',
      cameraView: 'right',
      wearerPosition: 'Wearer Right Sleeve',
      maxWidthInches: 4.0,
      maxHeightInches: 10.0,
      maxDimension: '4" × 10"',
      xOffsetInches: 0.0,
      yOffsetInches: 2.0,
      bounds: { x: 0.10, y: 0.26, w: 0.18, h: 0.26 },
      fee: 80,
    },
  ],

  // =========================================================================
  // 2. OVERSIZED STREETWEAR T-SHIRT
  // =========================================================================
  'oversized-tshirt': [
    {
      id: 'center_chest',
      name: 'Center Chest',
      shortDesc: 'Boxy streetwear center chest illustration',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Center Chest',
      maxWidthInches: 12.0,
      maxHeightInches: 14.0,
      maxDimension: '12" × 14"',
      xOffsetInches: 0.0,
      yOffsetInches: 4.5,
      bounds: { x: 0.30, y: 0.24, w: 0.40, h: 0.44 },
      fee: 0,
      isPrimary: true,
    },
    {
      id: 'left_chest',
      name: 'Left Chest (Wearer Left)',
      shortDesc: 'Minimalist streetwear badge on wearer left chest',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Wearer Left Chest',
      maxWidthInches: 4.5,
      maxHeightInches: 4.5,
      maxDimension: '4.5" × 4.5"',
      xOffsetInches: 4.5,
      yOffsetInches: 4.5,
      bounds: { x: 0.58, y: 0.24, w: 0.20, h: 0.20 },
      fee: 80,
    },
    {
      id: 'right_chest',
      name: 'Right Chest (Wearer Right)',
      shortDesc: 'Minimalist streetwear badge on wearer right chest',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Wearer Right Chest',
      maxWidthInches: 4.5,
      maxHeightInches: 4.5,
      maxDimension: '4.5" × 4.5"',
      xOffsetInches: -4.5,
      yOffsetInches: 4.5,
      bounds: { x: 0.22, y: 0.24, w: 0.20, h: 0.20 },
      fee: 80,
    },
    {
      id: 'full_front',
      name: 'Full Front Jumbo Print',
      shortDesc: 'Oversized jumbo streetwear art from collar to waist',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Full Front Torso',
      maxWidthInches: 15.0,
      maxHeightInches: 18.0,
      maxDimension: '15" × 18"',
      xOffsetInches: 0.0,
      yOffsetInches: 4.0,
      bounds: { x: 0.24, y: 0.22, w: 0.52, h: 0.60 },
      fee: 140,
    },
    {
      id: 'full_back',
      name: 'Full Back Oversized Poster',
      shortDesc: 'Massive heavy-coverage back tour graphic',
      surface: 'back',
      cameraView: 'back',
      wearerPosition: 'Full Back Torso',
      maxWidthInches: 15.0,
      maxHeightInches: 18.0,
      maxDimension: '15" × 18"',
      xOffsetInches: 0.0,
      yOffsetInches: 4.0,
      bounds: { x: 0.24, y: 0.22, w: 0.52, h: 0.60 },
      fee: 100,
    },
    {
      id: 'upper_back',
      name: 'Upper Back / Neck',
      shortDesc: 'Streetwear neck branding arch',
      surface: 'back',
      cameraView: 'back',
      wearerPosition: 'Upper Back Neck',
      maxWidthInches: 12.0,
      maxHeightInches: 6.0,
      maxDimension: '12" × 6"',
      xOffsetInches: 0.0,
      yOffsetInches: 2.5,
      bounds: { x: 0.30, y: 0.18, w: 0.40, h: 0.20 },
      fee: 100,
    },
    {
      id: 'left_sleeve',
      name: 'Left Sleeve Drop Shoulder',
      shortDesc: 'Wide drop-shoulder sleeve graphic (wearer left)',
      surface: 'left',
      cameraView: 'left',
      wearerPosition: 'Wearer Left Sleeve',
      maxWidthInches: 5.0,
      maxHeightInches: 10.0,
      maxDimension: '5" × 10"',
      xOffsetInches: 0.0,
      yOffsetInches: 3.0,
      bounds: { x: 0.74, y: 0.28, w: 0.20, h: 0.28 },
      fee: 80,
    },
    {
      id: 'right_sleeve',
      name: 'Right Sleeve Drop Shoulder',
      shortDesc: 'Wide drop-shoulder sleeve graphic (wearer right)',
      surface: 'right',
      cameraView: 'right',
      wearerPosition: 'Wearer Right Sleeve',
      maxWidthInches: 5.0,
      maxHeightInches: 10.0,
      maxDimension: '5" × 10"',
      xOffsetInches: 0.0,
      yOffsetInches: 3.0,
      bounds: { x: 0.06, y: 0.28, w: 0.20, h: 0.28 },
      fee: 80,
    },
  ],

  // =========================================================================
  // 3. POLO T-SHIRT (PIQUÉ)
  // =========================================================================
  'polo-tshirt': [
    {
      id: 'left_chest',
      name: 'Left Chest (Corporate / Pocket)',
      shortDesc: 'Standard corporate embroidery or DTF logo on wearer left',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Wearer Left Chest',
      maxWidthInches: 4.0,
      maxHeightInches: 4.0,
      maxDimension: '4" × 4"',
      xOffsetInches: 4.0,
      yOffsetInches: 5.0,
      bounds: { x: 0.58, y: 0.26, w: 0.18, h: 0.18 },
      fee: 0,
      isPrimary: true,
    },
    {
      id: 'right_chest',
      name: 'Right Chest',
      shortDesc: 'Name tag or department emblem on wearer right',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Wearer Right Chest',
      maxWidthInches: 4.0,
      maxHeightInches: 4.0,
      maxDimension: '4" × 4"',
      xOffsetInches: -4.0,
      yOffsetInches: 5.0,
      bounds: { x: 0.24, y: 0.26, w: 0.18, h: 0.18 },
      fee: 80,
    },
    {
      id: 'center_chest',
      name: 'Center Front (Below Placket)',
      shortDesc: 'Positioned cleanly below the buttoned polo placket',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Center Front Torso',
      maxWidthInches: 10.0,
      maxHeightInches: 12.0,
      maxDimension: '10" × 12"',
      xOffsetInches: 0.0,
      yOffsetInches: 8.0,
      bounds: { x: 0.32, y: 0.38, w: 0.36, h: 0.38 },
      fee: 100,
    },
    {
      id: 'upper_back',
      name: 'Upper Back / Shoulder Yoke',
      shortDesc: 'Clean horizontal company name across upper back',
      surface: 'back',
      cameraView: 'back',
      wearerPosition: 'Upper Back',
      maxWidthInches: 10.0,
      maxHeightInches: 5.0,
      maxDimension: '10" × 5"',
      xOffsetInches: 0.0,
      yOffsetInches: 2.5,
      bounds: { x: 0.32, y: 0.18, w: 0.36, h: 0.18 },
      fee: 100,
    },
    {
      id: 'full_back',
      name: 'Back Center',
      shortDesc: 'Large organization or event logo across back center',
      surface: 'back',
      cameraView: 'back',
      wearerPosition: 'Back Center',
      maxWidthInches: 11.0,
      maxHeightInches: 13.0,
      maxDimension: '11" × 13"',
      xOffsetInches: 0.0,
      yOffsetInches: 4.0,
      bounds: { x: 0.28, y: 0.22, w: 0.44, h: 0.48 },
      fee: 100,
    },
    {
      id: 'left_sleeve',
      name: 'Left Sleeve Cuff',
      shortDesc: 'Emblem badge on wearer left polo sleeve',
      surface: 'left',
      cameraView: 'left',
      wearerPosition: 'Wearer Left Sleeve',
      maxWidthInches: 3.5,
      maxHeightInches: 8.0,
      maxDimension: '3.5" × 8"',
      xOffsetInches: 0.0,
      yOffsetInches: 2.0,
      bounds: { x: 0.72, y: 0.28, w: 0.16, h: 0.22 },
      fee: 80,
    },
    {
      id: 'right_sleeve',
      name: 'Right Sleeve Cuff',
      shortDesc: 'Emblem badge on wearer right polo sleeve',
      surface: 'right',
      cameraView: 'right',
      wearerPosition: 'Wearer Right Sleeve',
      maxWidthInches: 3.5,
      maxHeightInches: 8.0,
      maxDimension: '3.5" × 8"',
      xOffsetInches: 0.0,
      yOffsetInches: 2.0,
      bounds: { x: 0.12, y: 0.28, w: 0.16, h: 0.22 },
      fee: 80,
    },
  ],

  // =========================================================================
  // 4. HEAVYWEIGHT FLEECE HOODIE
  // =========================================================================
  'hoodie': [
    {
      id: 'center_chest',
      name: 'Center Chest (Above Pocket)',
      shortDesc: 'Calibrated above kangaroo pocket and drawstrings',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Center Chest',
      maxWidthInches: 10.0,
      maxHeightInches: 10.0,
      maxDimension: '10" × 10"',
      xOffsetInches: 0.0,
      yOffsetInches: 4.5,
      bounds: { x: 0.32, y: 0.26, w: 0.36, h: 0.32 },
      fee: 0,
      isPrimary: true,
    },
    {
      id: 'left_chest',
      name: 'Left Chest (Wearer Left)',
      shortDesc: 'Subtle logo above left side of kangaroo pouch',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Wearer Left Chest',
      maxWidthInches: 4.0,
      maxHeightInches: 4.0,
      maxDimension: '4" × 4"',
      xOffsetInches: 4.0,
      yOffsetInches: 4.5,
      bounds: { x: 0.58, y: 0.26, w: 0.18, h: 0.18 },
      fee: 80,
    },
    {
      id: 'right_chest',
      name: 'Right Chest (Wearer Right)',
      shortDesc: 'Subtle logo above right side of kangaroo pouch',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Wearer Right Chest',
      maxWidthInches: 4.0,
      maxHeightInches: 4.0,
      maxDimension: '4" × 4"',
      xOffsetInches: -4.0,
      yOffsetInches: 4.5,
      bounds: { x: 0.24, y: 0.26, w: 0.18, h: 0.18 },
      fee: 80,
    },
    {
      id: 'full_back',
      name: 'Full Back Statement',
      shortDesc: 'Large high-impact statement graphic across back',
      surface: 'back',
      cameraView: 'back',
      wearerPosition: 'Full Back Torso',
      maxWidthInches: 14.0,
      maxHeightInches: 16.0,
      maxDimension: '14" × 16"',
      xOffsetInches: 0.0,
      yOffsetInches: 4.0,
      bounds: { x: 0.26, y: 0.22, w: 0.48, h: 0.54 },
      fee: 100,
    },
    {
      id: 'upper_back',
      name: 'Upper Back / Below Hood',
      shortDesc: 'Horizontal branding visible under relaxed hood',
      surface: 'back',
      cameraView: 'back',
      wearerPosition: 'Upper Back',
      maxWidthInches: 12.0,
      maxHeightInches: 5.0,
      maxDimension: '12" × 5"',
      xOffsetInches: 0.0,
      yOffsetInches: 3.0,
      bounds: { x: 0.30, y: 0.22, w: 0.40, h: 0.18 },
      fee: 100,
    },
    {
      id: 'left_sleeve',
      name: 'Left Sleeve',
      shortDesc: 'Long vertical typography along wearer left arm',
      surface: 'left',
      cameraView: 'left',
      wearerPosition: 'Wearer Left Sleeve',
      maxWidthInches: 4.0,
      maxHeightInches: 12.0,
      maxDimension: '4" × 12"',
      xOffsetInches: 0.0,
      yOffsetInches: 2.5,
      bounds: { x: 0.74, y: 0.28, w: 0.18, h: 0.32 },
      fee: 80,
    },
    {
      id: 'right_sleeve',
      name: 'Right Sleeve',
      shortDesc: 'Long vertical typography along wearer right arm',
      surface: 'right',
      cameraView: 'right',
      wearerPosition: 'Wearer Right Sleeve',
      maxWidthInches: 4.0,
      maxHeightInches: 12.0,
      maxDimension: '4" × 12"',
      xOffsetInches: 0.0,
      yOffsetInches: 2.5,
      bounds: { x: 0.08, y: 0.28, w: 0.18, h: 0.32 },
      fee: 80,
    },
  ],

  // =========================================================================
  // 5. BARISTA & KITCHEN APRON
  // =========================================================================
  'apron': [
    {
      id: 'apron_bib',
      name: 'Upper Bib Chest',
      shortDesc: 'High-visibility restaurant or cafe brand logo',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Bib Upper Chest',
      maxWidthInches: 8.0,
      maxHeightInches: 8.0,
      maxDimension: '8" × 8"',
      xOffsetInches: 0.0,
      yOffsetInches: 2.0,
      bounds: { x: 0.36, y: 0.20, w: 0.28, h: 0.24 },
      fee: 0,
      isPrimary: true,
    },
    {
      id: 'apron_center',
      name: 'Center Torso',
      shortDesc: 'Large statement graphic above utility pocket',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Center Torso',
      maxWidthInches: 9.0,
      maxHeightInches: 10.0,
      maxDimension: '9" × 10"',
      xOffsetInches: 0.0,
      yOffsetInches: 6.0,
      bounds: { x: 0.32, y: 0.34, w: 0.36, h: 0.26 },
      fee: 80,
    },
    {
      id: 'apron_pocket',
      name: 'Utility Pocket Area',
      shortDesc: 'Subtle print across lower front pocket pouch',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Front Pocket',
      maxWidthInches: 7.0,
      maxHeightInches: 4.5,
      maxDimension: '7" × 4.5"',
      xOffsetInches: 0.0,
      yOffsetInches: 12.0,
      bounds: { x: 0.32, y: 0.62, w: 0.36, h: 0.18 },
      fee: 80,
    },
  ],

  // =========================================================================
  // 6. 11OZ CERAMIC MUG
  // =========================================================================
  'cup': [
    {
      id: 'cup_front',
      name: 'Front Facing (Right-Hand Grip)',
      shortDesc: 'Visible to others when drinking with right hand',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Front Face (Right Hand)',
      maxWidthInches: 3.5,
      maxHeightInches: 3.5,
      maxDimension: '3.5" × 3.5"',
      xOffsetInches: 0.0,
      yOffsetInches: 0.0,
      bounds: { x: 0.26, y: 0.28, w: 0.46, h: 0.48 },
      fee: 0,
      isPrimary: true,
    },
    {
      id: 'cup_back',
      name: 'Back Facing (Left-Hand Grip)',
      shortDesc: 'Visible when drinking with left hand',
      surface: 'back',
      cameraView: 'back',
      wearerPosition: 'Back Face (Left Hand)',
      maxWidthInches: 3.5,
      maxHeightInches: 3.5,
      maxDimension: '3.5" × 3.5"',
      xOffsetInches: 0.0,
      yOffsetInches: 0.0,
      bounds: { x: 0.26, y: 0.28, w: 0.46, h: 0.48 },
      fee: 50,
    },
    {
      id: 'cup_wrap',
      name: 'Full Panoramic 360° Wrap',
      shortDesc: 'Seamless panoramic illustration wrapped around cylinder',
      surface: 'front',
      cameraView: 'wrap',
      wearerPosition: 'Full 360° Wrap',
      maxWidthInches: 8.5,
      maxHeightInches: 3.5,
      maxDimension: '8.5" × 3.5"',
      xOffsetInches: 0.0,
      yOffsetInches: 0.0,
      bounds: { x: 0.22, y: 0.26, w: 0.54, h: 0.52 },
      fee: 100,
    },
  ],

  // =========================================================================
  // 7. STRUCTURED SNAPBACK CAP
  // =========================================================================
  'cap': [
    {
      id: 'cap_front',
      name: 'Front Crown Panel',
      shortDesc: 'Centered across structured 2-front crown panels',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Front Crown',
      maxWidthInches: 4.5,
      maxHeightInches: 2.5,
      maxDimension: '4.5" × 2.5"',
      xOffsetInches: 0.0,
      yOffsetInches: 0.0,
      bounds: { x: 0.28, y: 0.32, w: 0.44, h: 0.22 },
      fee: 0,
      isPrimary: true,
    },
    {
      id: 'cap_left',
      name: 'Left Side Panel (Wearer Left)',
      shortDesc: 'Side logo along wearer left temple panel',
      surface: 'left',
      cameraView: 'left',
      wearerPosition: 'Wearer Left Panel',
      maxWidthInches: 2.5,
      maxHeightInches: 2.0,
      maxDimension: '2.5" × 2.0"',
      xOffsetInches: 2.0,
      yOffsetInches: 0.0,
      bounds: { x: 0.58, y: 0.34, w: 0.22, h: 0.18 },
      fee: 60,
    },
    {
      id: 'cap_right',
      name: 'Right Side Panel (Wearer Right)',
      shortDesc: 'Side logo along wearer right temple panel',
      surface: 'right',
      cameraView: 'right',
      wearerPosition: 'Wearer Right Panel',
      maxWidthInches: 2.5,
      maxHeightInches: 2.0,
      maxDimension: '2.5" × 2.0"',
      xOffsetInches: -2.0,
      yOffsetInches: 0.0,
      bounds: { x: 0.20, y: 0.34, w: 0.22, h: 0.18 },
      fee: 60,
    },
    {
      id: 'cap_back',
      name: 'Back Arch / Above Strap',
      shortDesc: 'Curved text arch above snapback strap',
      surface: 'back',
      cameraView: 'back',
      wearerPosition: 'Back Arch',
      maxWidthInches: 3.5,
      maxHeightInches: 1.5,
      maxDimension: '3.5" × 1.5"',
      xOffsetInches: 0.0,
      yOffsetInches: 0.0,
      bounds: { x: 0.30, y: 0.38, w: 0.40, h: 0.14 },
      fee: 60,
    },
  ],

  // =========================================================================
  // 8. PIN BUTTON BADGE
  // =========================================================================
  'badge': [
    {
      id: 'badge_face',
      name: 'Front Button Face',
      shortDesc: 'Circular high-gloss mylar print area with safety margin',
      surface: 'front',
      cameraView: 'front',
      wearerPosition: 'Circular Face',
      maxWidthInches: 2.25,
      maxHeightInches: 2.25,
      maxDimension: '2.25" Circular',
      xOffsetInches: 0.0,
      yOffsetInches: 0.0,
      bounds: { x: 0.15, y: 0.15, w: 0.70, h: 0.70 },
      fee: 0,
      isPrimary: true,
    },
  ],
};

const LOCAL_STORAGE_CALIBRATION_KEY = 'printhub_custom_calibrations_v1';

/**
 * Get Custom Overrides from LocalStorage
 */
export function getSavedCalibrations() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_CALIBRATION_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Save Custom Overrides to LocalStorage
 */
export function saveCalibrationOverride(productId, placementId, updates) {
  try {
    const all = getSavedCalibrations();
    if (!all[productId]) all[productId] = {};
    all[productId][placementId] = {
      ...(all[productId][placementId] || {}),
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_CALIBRATION_KEY, JSON.stringify(all));
    return true;
  } catch (e) {
    console.error('Failed to save calibration:', e);
    return false;
  }
}

/**
 * Reset Custom Calibrations for a Product or All Products
 */
export function resetCalibrationOverrides(productId = null) {
  try {
    if (!productId) {
      localStorage.removeItem(LOCAL_STORAGE_CALIBRATION_KEY);
    } else {
      const all = getSavedCalibrations();
      delete all[productId];
      localStorage.setItem(LOCAL_STORAGE_CALIBRATION_KEY, JSON.stringify(all));
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get Effective Calibrated Print Area for a Product, Size, and Placement ID
 */
export function getCalibratedPrintArea(productId, size = 'L', placementId = null) {
  const masterList = MASTER_CALIBRATIONS[productId] || MASTER_CALIBRATIONS['round-neck-tshirt'];
  const overrides = getSavedCalibrations()[productId] || {};

  let matched = null;
  if (placementId) {
    matched = masterList.find((a) => a.id === placementId);
  }
  if (!matched) {
    matched = masterList[0];
  }

  // Merge with any custom saved overrides
  const custom = overrides[matched.id] || {};
  const effective = { ...matched, ...custom };

  // Adjust bounds dynamically if garment size affects scale
  const sizeDims = GARMENT_SIZE_DIMENSIONS[productId]?.[size] || GARMENT_SIZE_DIMENSIONS[productId]?.['L'];
  const baseDims = GARMENT_SIZE_DIMENSIONS[productId]?.['L'] || sizeDims;

  if (sizeDims && baseDims && sizeDims.widthInches !== baseDims.widthInches) {
    // Slight proportional compensation for larger/smaller garment sizes
    const scaleRatio = baseDims.widthInches / sizeDims.widthInches;
    effective.sizeAdjustedWidthPercent = scaleRatio;
  }

  return effective;
}

/**
 * Get All Calibrated Print Areas for a Product
 */
export function getProductPrintAreas(productId, size = 'L') {
  const masterList = MASTER_CALIBRATIONS[productId] || MASTER_CALIBRATIONS['round-neck-tshirt'];
  const overrides = getSavedCalibrations()[productId] || {};

  return masterList.map((item) => {
    const custom = overrides[item.id] || {};
    return { ...item, ...custom };
  });
}
