/**
 * cfs: custom final steps
 */
import { ISettings } from '../interfaces/i-settings'
import fs from 'fs'
import yaml from 'js-yaml'

/**
 * cfs
 */
export default class CFS {

   /**
    * steps
    * @returns 
    */
   steps(): string[] {
      let configRoot = '/etc/penguins-eggs.d/krill/'
      if (fs.existsSync('/etc/calamares/settings.conf')) {
        configRoot = '/etc/calamares/'
       }
   
      const cfs: string[] = []
      const settingsVar: string = fs.readFileSync(`${configRoot}settings.conf`, 'utf8')
      const settingsYaml = yaml.load(settingsVar) as ISettings
      const execSequence = settingsYaml.sequence[1]
      const steps = execSequence.exec
      for (const step of steps) {
         if (step.includes('cfs-')) {
            cfs.push(step)
         }
      }
      return cfs
   }
}
