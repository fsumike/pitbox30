import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname } from 'path';

const gradleWrapperProps = `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-all.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;

const variablesGradle = `ext {
    minSdkVersion = 22
    compileSdkVersion = 34
    targetSdkVersion = 34
    androidxActivityVersion = '1.8.0'
    androidxAppCompatVersion = '1.6.1'
    androidxCoordinatorLayoutVersion = '1.2.0'
    androidxCoreVersion = '1.12.0'
    androidxFragmentVersion = '1.6.2'
    coreSplashScreenVersion = '1.0.1'
    androidxWebkitVersion = '1.9.0'
    junitVersion = '4.13.2'
    androidxJunitVersion = '1.1.5'
    androidxEspressoCoreVersion = '3.5.1'
    cordovaAndroidVersion = '10.1.1'
}
`;

const propsPath = 'android/gradle/wrapper/gradle-wrapper.properties';
const variablesPath = 'android/variables.gradle';
const buildGradlePath = 'android/build.gradle';

if (existsSync('android')) {
  mkdirSync(dirname(propsPath), { recursive: true });
  writeFileSync(propsPath, gradleWrapperProps);
  console.log('Updated gradle-wrapper.properties to use Gradle 8.7 (Java 21 compatible)');

  writeFileSync(variablesPath, variablesGradle);
  console.log('Updated variables.gradle to use SDK 34 (JDK 21 compatible)');

  if (existsSync(buildGradlePath)) {
    let buildGradle = readFileSync(buildGradlePath, 'utf8');
    buildGradle = buildGradle.replace(
      /classpath\s+['"]com\.android\.tools\.build:gradle:[^'"]+['"]/g,
      "classpath 'com.android.tools.build:gradle:8.2.2'"
    );
    writeFileSync(buildGradlePath, buildGradle);
    console.log('Updated build.gradle to use AGP 8.2.2 (JDK 21 compatible)');
  }
} else {
  console.log('Android folder not found, skipping gradle fix');
}
